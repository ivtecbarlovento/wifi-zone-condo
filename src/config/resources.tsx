import type { IResourceItem } from "@refinedev/core";

import {
    DashboardOutlined,
    FundOutlined,
    MonitorOutlined,
    ProjectOutlined,
    ShopOutlined,
    TeamOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [

    {
        name: "clients",
        list: "/clients",
        create: "/clients/new",
        edit: "/clients/edit/:id",
        meta: {
            label: "Clients",
            icon: <TeamOutlined />,
        },
    },
];