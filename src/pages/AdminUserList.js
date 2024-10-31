import React, { useEffect, useState } from 'react';
import { Container, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/header';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const usersPerPage = 10;
    const apiUrl = `${process.env.REACT_APP_API_URL}/admin/users`;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                    },
                    params: {
                        page: currentPage,
                        limit: usersPerPage,
                    },
                });
                console.log("Users:", response.data.users); // Debugging
                console.log("Total Pages:", response.data.totalPages); // Debugging
    
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentPage]);
    

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div>
            <Header />
            <Container className='mt-4'>
                <h2>User List</h2>

                {loading ? (
                    <p>Loading users...</p>

                ) : (
                    <>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Pagination className='justify-content-center mt-3'>
                            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </>
                )}
            </Container>
        </div>
    );
};

export default AdminUserList;