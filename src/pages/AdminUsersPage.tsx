import { useEffect, useState } from 'react';
import { Card, Badge, Button, Select, Input, apiClient, useAuth } from 'astrogators-shared-ui';
import { Layout } from '../components/Layout';
import './AdminUsersPage.css';

// Mirrors astrogators-table's UserResponse (src/schemas/users.py) — kept
// local rather than sharing shared-ui's narrower `User` type (which models
// the *current* user's own /me shape and uses a string id).
interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: 'admin' | 'mod' | 'user';
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

interface UserListResponse {
  items: AdminUser[];
  total: number;
}

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'mod', label: 'Mod' },
  { value: 'admin', label: 'Admin' },
];

/**
 * True when `targetId` is the currently-logged-in admin's own account.
 * Role changes and deactivation are refused server-side for self either
 * way - this only disables the controls in the UI so nobody reaches for a
 * button that can't work.
 *
 * `currentUser.id` is typed `string` by shared-ui's narrower `User` (the
 * current-user /me shape), but astrogators-table actually sends `id` as a
 * JSON number - so at runtime it's a number wearing a `string` type, and a
 * plain `String(targetId) === currentUser.id` comparison (the pattern this
 * file used before, for the same self-resync check on role change) silently
 * never matches. Number() on both sides is correct either way this ever
 * gets fixed upstream.
 */
const isSelf = (targetId: number, currentUser: { id: string } | null): boolean =>
  currentUser != null && Number(targetId) === Number(currentUser.id);

export default function AdminUsersPage() {
  const { user: currentUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [updatingActiveId, setUpdatingActiveId] = useState<number | null>(null);
  const [updatingVerifyId, setUpdatingVerifyId] = useState<number | null>(null);

  const loadUsers = async (searchTerm: string) => {
    setIsLoading(true);
    setError('');
    try {
      const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await apiClient.get<UserListResponse>(`/api/v1/users${query}`);
      setUsers(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(search);
  };

  const handleRoleChange = async (targetUser: AdminUser, newRole: string) => {
    setError('');
    setUpdatingId(targetUser.id);
    try {
      const updated = await apiClient.patch<AdminUser>(`/api/v1/users/${targetUser.id}/role`, {
        role: newRole,
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      // No self-resync needed here: the backend now refuses a self-role-change
      // outright (403), and the Select for your own row is disabled anyway, so
      // this call is never made against your own id.
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleActiveToggle = async (targetUser: AdminUser) => {
    const nextActive = !targetUser.is_active;

    if (nextActive === false) {
      const confirmed = window.confirm(
        `Deactivate ${targetUser.username}? They will be signed out of every device immediately and unable to log back in until reactivated.`
      );
      if (!confirmed) return;
    }

    setError('');
    setUpdatingActiveId(targetUser.id);
    try {
      const updated = await apiClient.patch<AdminUser>(`/api/v1/users/${targetUser.id}/active`, {
        is_active: nextActive,
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err: any) {
      setError(err.message || 'Failed to update active status');
    } finally {
      setUpdatingActiveId(null);
    }
  };

  const handleVerify = async (targetUser: AdminUser) => {
    setError('');
    setUpdatingVerifyId(targetUser.id);
    try {
      const updated = await apiClient.post<AdminUser>(`/api/v1/users/${targetUser.id}/verify`);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

      // Unlike role/active, verifying yourself is allowed - resync so the
      // VerificationBanner and the badge on your own Profile page clear.
      if (isSelf(targetUser.id, currentUser)) {
        await refreshUser();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify email');
    } finally {
      setUpdatingVerifyId(null);
    }
  };

  return (
    <Layout>
      <div className="admin-users-page">
        <h1 className="admin-users-title">User Management</h1>

        <Card chamfered chamferSize="md" padding="lg" className="admin-users-card">
          <form className="admin-users-search" onSubmit={handleSearchSubmit}>
            <Input
              type="text"
              placeholder="Search by email or username"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {error && <div className="admin-users-error-message">{error}</div>}

          {isLoading ? (
            <p className="admin-users-loading">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="admin-users-empty">No users found.</p>
          ) : (
            <div className="admin-users-list">
              {users.map((u) => {
                const self = isSelf(u.id, currentUser);
                return (
                  <div key={u.id} className="admin-user-item">
                    <div className="admin-user-item-info">
                      <div className="admin-user-item-username">
                        {u.username}
                        {self && <span className="admin-user-item-you"> (you)</span>}
                      </div>
                      <div className="admin-user-item-email">{u.email}</div>
                      <div className="admin-user-item-badges">
                        <Badge variant={u.is_verified ? 'success' : 'warning'} size="sm">
                          {u.is_verified ? 'Verified' : 'Not Verified'}
                        </Badge>
                        <Badge variant={u.is_active ? 'success' : 'error'} size="sm">
                          {u.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="admin-user-item-actions">
                      <Select
                        options={ROLE_OPTIONS}
                        value={u.role}
                        disabled={self || updatingId === u.id}
                        title={self ? "You can't change your own role" : undefined}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                      />
                      {!u.is_verified && (
                        <Button
                          variant="secondary"
                          size="sm"
                          loading={updatingVerifyId === u.id}
                          onClick={() => handleVerify(u)}
                        >
                          Verify Email
                        </Button>
                      )}
                      <Button
                        variant={u.is_active ? 'outline' : 'secondary'}
                        size="sm"
                        disabled={self}
                        title={self ? "You can't deactivate your own account" : undefined}
                        loading={updatingActiveId === u.id}
                        onClick={() => handleActiveToggle(u)}
                      >
                        {u.is_active ? 'Deactivate' : 'Reactivate'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="admin-users-total">{total} total user{total === 1 ? '' : 's'}</p>
        </Card>
      </div>
    </Layout>
  );
}
