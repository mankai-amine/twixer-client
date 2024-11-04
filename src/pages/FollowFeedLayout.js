import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import FollowFeed from '../components/FollowFeed';

const FollowFeedLayout = () => {
    return (
        <div style={{ backgroundColor: '#e3eef8' }}>
            <Header />
            <Container fluid>
                <Row>
                    <Col md={3} className='p-0'>
                        <Sidebar />
                    </Col>
                    <Col md={9} className='p-4'>
                        <FollowFeed />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FollowFeedLayout;