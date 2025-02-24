import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import { useGo } from '@refinedev/core';
import { URL_API } from '../../authProvider';

interface IClient {
    id: number;
    name: string;
    last_name: string;
    id_number: number;
    status: string;
    zone_name: string;
    username: string;
    password: string;
}

const ClientList: React.FC = () => {
    const [dataSource, setDataSource] = useState<IClient[]>([]);
    const go = useGo();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${URL_API}/clients`);
                const data = await response.json();
                setDataSource(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Last Name",
            dataIndex: "last_name",
            key: "last_name",
        },
        {
            title: "ID Number",
            dataIndex: "id_number",
            key: "id_number",
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (status: string) => (
                <Tag color={status === "Active" ? "green" : "volcano"}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Zone",
            dataIndex: "zone_name",
            key: "zone_name",
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Password",
            dataIndex: "password",
            key: "password",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text: any, record: IClient) => (
                <span>
                    <Button style={{ marginRight: 16 }} onClick={() => go({ to: `/clients/edit/${record.id_number}`, type: 'replace' })}>
                        <EditFilled />
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this client?"
                        onConfirm={() => {
                            fetch(`${URL_API}/clients/${record.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            }).then(() => {
                                // Refresh the list after deleting
                                setDataSource(prev => prev.filter(client => client.id !== record.id));
                            });
                        }}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button style={{ color: 'red', marginRight: 16 }}>
                            <DeleteFilled />
                        </Button>
                    </Popconfirm>
                    <Button style={{marginTop : "10px"}} onClick={() => {
                        // Logic to activate/deactivate client
                        const newStatus = record.status === "Active" ? "Inactive" : "Active";
                        // Update the status in the backend and refresh the list
                        fetch(`${URL_API}/clients/${record.id_number}/status`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ ...record, status: newStatus }),
                        }).then(() => {
                            // Refresh the list after updating
                            setDataSource(prev => prev.map(client => client.id === record.id ? { ...client, status: newStatus } : client));
                        });
                    }}>
                        {record.status === "Active" ? "Deactivate" : "Activate"}
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => go({ to: "/clients/create", type: "replace" })}>
                Add Client
            </Button>
            <Table dataSource={dataSource} columns={columns} rowKey="id" style={{marginRight : "15px"}} />
        </div>
    );
};

export default ClientList;