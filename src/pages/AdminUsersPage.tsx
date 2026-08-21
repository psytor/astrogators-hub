import { useEffect, useState } from 'react';
import { Card, Badge, Select, Input, apiClient, useAuth } from 'astrogators-shared-ui';
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

export default function AdminUsersPage() {
  const { user: currentUser, refreshUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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

      // If the admin changed their own role, resync the session so the
      // AdminRoute guard reflects it on the next navigation.
      if (currentUser && String(targetUser.id) === currentUser.id) {
        await refreshUser();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
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
              {users.map((u) => (
                <div key={u.id} className="admin-user-item">
                  <div className="admin-user-item-info">
                    <div className="admin-user-item-username">{u.username}</div>
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
                  <div className="admin-user-item-role">
                    <Select
                      options={ROLE_OPTIONS}
                      value={u.role}
                      disabled={updatingId === u.id}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="admin-users-total">{total} total user{total === 1 ? '' : 's'}</p>
        </Card>
      </div>
    </Layout>
  );
}
