import React, { useEffect, useState } from 'react';
import { Container, Table, Pagination, Button, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/header';
import Sidebar from '../components/sidebar';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // For error handling

    const usersPerPage = 10;
    const apiUrl1 = `${process.env.REACT_APP_API_URL}/users/all`;
    const apiUrlBan = `${process.env.REACT_APP_API_URL}/users/status`;
    const apiUrlRole = `${process.env.REACT_APP_API_URL}/users/role`;

    const roles = ["user", "admin"];

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(apiUrl1, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                    },
                    params: {
                        page: currentPage,
                        limit: usersPerPage,
                    },
                });
                
                const { data, pagination } = response.data;
                setUsers(data || []);
                setTotalUsers(pagination.totalCount);
                setTotalPages(pagination.totalPages);
            } catch (error) {
                setError(`Failed to fetch users: ${error.response?.data?.error || error.message}`);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentPage, apiUrl1]);

    const banUser = async (id) => {
        try {
            await axios.patch(`${apiUrlBan}/${id}/ban`, {}, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                },
            });
            // Update the user's status locally after banning
            setUsers(users.map(user => user.id === id ? { ...user, account_status: 'banned' } : user));
        } catch (error) {
            console.error(`Failed to ban user: ${error.response?.data?.message || error.message}`);
            alert(`Failed to ban user: ${error.response?.data?.message || error.message}`);
        }
    };

    const unbanUser = async (id) => {
        try {
            await axios.patch(`${apiUrlBan}/${id}/unban`, {}, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                },
            });
            // Update the user's status locally after unbanning
            setUsers(users.map(user => user.id === id ? { ...user, account_status: 'active' } : user));
        } catch (error) {
            console.error(`Failed to unban user: ${error.response?.data?.message || error.message}`);
            alert(`Failed to unban user: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.patch(`${apiUrlRole}/${userId}`, { role: newRole }, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                },
            });
            setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
        } catch (error) {
            console.error(`Failed to update role: ${error.response?.data?.message || error.message}`);
            alert(`Failed to update role: ${error.response?.data?.message || error.message}`);
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
                    1
                </Pagination.Item>
            );
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis1" />);
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </Pagination.Item>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis2" />);
            }
            items.push(
                <Pagination.Item
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };
    

    return (
        <div>
            <Header />
            <Container fluid className="mt-4">
                <Row>
                    <Col md={3} lg={2} className="px-0">
                        <Sidebar />
                    </Col>
                    <Col md={9} lg={10}>
                        <h2 className="text-center">User List</h2>

                        {loading ? (
                            <p>Loading users...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : (
                            <>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Bio</th>
                                            <th>Creation Date</th>
                                            <th>User Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <Form.Select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        >
                                                            {roles.map((role) => (
                                                                <option key={role} value={role}>{role}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </td>
                                                    <td>{user.account_status}</td>
                                                    <td>{user.bio}</td>
                                                    <td>{new Date(user.creation_date).toLocaleDateString()}</td>
                                                    <td>
                                                        <Button
                                                            variant={user.account_status === 'banned' ? 'success' : 'danger'}
                                                            onClick={() => user.account_status === 'banned' ? unbanUser(user.id) : banUser(user.id)}
                                                            style={{ textAlign: 'center' }}
                                                        >
                                                            {user.account_status === 'banned' ? 'Unban' : 'Ban'}
                                                        </Button>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center' }}>
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <div className="d-flex flex-column align-items-center mb-4">
                                    <div className="mb-2">
                                        Showing {(currentPage - 1) * usersPerPage + 1} - {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
                                    </div>
                                    <Pagination>
                                        <Pagination.First
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                        />
                                        <Pagination.Prev
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        />
                                        {renderPaginationItems()}
                                        <Pagination.Next
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        />
                                        <Pagination.Last
                                            onClick={() => setCurrentPage(totalPages)}
                                            disabled={currentPage === totalPages}
                                        />
                                    </Pagination>
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminUserList;
