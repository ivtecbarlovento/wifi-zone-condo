import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, notification } from "antd";
import { useModalForm } from '@refinedev/antd';
import { useGo, HttpError, useCustom } from '@refinedev/core';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { URL_API } from '../../authProvider';

const Edit = () => {
    const go = useGo();
    const { id: id_number } = useParams<{ id: string }>();

    const [initialValues, setInitialValues] = useState<any>(null);

    const goToClientList = () => {
        go({
            to: "/clients",
            type: "replace"
        });
    }

    const { formProps, modalProps } = useModalForm({
        action: "edit",
        defaultVisible: true,
        resource: "clients",
        redirect: false,
        mutationMode: "pessimistic",
        onMutationSuccess: goToClientList,
        meta: {
            title: "Edit Client",
        }
    });

    const { data: zonesData, isLoading: isZonesLoading } = useCustom({
        url: `${URL_API}/zones`,
        method: 'get',
    });

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const response = await axios.get(`${URL_API}/clients/${id_number}`);
                const clientData = response.data;
                setInitialValues({
                    ...clientData,
                    zone: clientData.zone_name, // Assuming the API returns zone_name
                });
            } catch (error) {
                console.error("Error fetching client data:", error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch client data. Please try again later.',
                });
            }
        };

        fetchClientData();
    }, [id_number, URL_API]);

    const handleFinish = async (values: any) => {
        try {
            const response = await axios.put(`${URL_API}/clients/${id_number}`, {
                name: values.name,
                last_name: values.last_name,
                id_number: values.id_number,
                status: values.status,
                id_zone: values.zone,
                username: values.username,
                password: values.password,
            });

            if (response.status === 200 || response.status === 201) {
                notification.success({
                    message: 'User Updated',
                    description: 'The user has been updated successfully.',
                });
                goToClientList();
            }
        } catch (error) {
            console.error("Error updating client:", error);
        }
    };

    return (
        <div>
            <Modal 
                {...modalProps} 
                onCancel={goToClientList} 
                afterClose={goToClientList}
            >
                <Form {...formProps} layout="vertical" onFinish={handleFinish} initialValues={initialValues}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label="Last Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="id_number"
                        label="ID Number"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="zone"
                        label="Zone"
                        rules={[{ required: true }]}
                    >
                        <Select loading={isZonesLoading}>
                            {zonesData?.data && zonesData.data.length > 0 ? (
                                zonesData.data.map((zone: any) => (
                                    <Select.Option key={zone.id} value={zone.id}>
                                        {zone.area}
                                    </Select.Option>
                                ))
                            ) : (
                                <Select.Option value="" disabled>
                                    No zones available
                                </Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Edit;