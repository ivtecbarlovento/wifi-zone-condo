import React from 'react';
import { Form, Input, Modal, Select, notification } from "antd";
import { useModalForm } from '@refinedev/antd';
import { useGo, HttpError, useCustom } from '@refinedev/core';
import axios from 'axios';
import { URL_API } from '../../authProvider';

const Create = () => {
    const go = useGo();


    const goToClientList = () => {
        go({
            to: "/clients",
            type: "replace"
        });
    }

    const { formProps, modalProps } = useModalForm({
        action: "create",
        defaultVisible: true,
        resource: "clients",
        redirect: false,
        mutationMode: "pessimistic",
        onMutationSuccess: goToClientList,
        meta: {
            title: "Create New Client",
        }
    });

    const { data: zonesData, isLoading: isZonesLoading } = useCustom({
        url: `${URL_API}/zones`,
        method: 'get',
    });

    const handleFinish = async (values: any) => {
        try {
            const response = await axios.post(`${URL_API}/clients`, {
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
                    message: 'User Created',
                    description: 'The user has been created successfully.',
                });
                goToClientList();
            }
        } catch (error) {
            console.error("Error creating client:", error);
        }
    };

    return (
        <div>
            <Modal 
                {...modalProps} 
                onCancel={goToClientList} 
                afterClose={goToClientList}
            >
                <Form {...formProps} layout="vertical" onFinish={handleFinish}>
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
                        <Select defaultValue="Active">
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="zone"
                        label="Zone"
                        rules={[{ required: true }]}
                    >
                        <Select loading={isZonesLoading} defaultValue={zonesData?.data[0]?.id}>
                            {zonesData?.data.map((zone: any) => (
                                <Select.Option key={zone.id} value={zone.id}>
                                    {zone.area}
                                </Select.Option>
                            ))}
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

export default Create;