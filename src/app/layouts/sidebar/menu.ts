import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARD.TEXT',
        icon: 'ph-gauge',
        subItems: [
            {
                id: 7,
                label: 'MENUITEMS.DASHBOARD.LIST.INDEX',
                link: '/index',
                parentId: 2
            }
        ]
    },
    {
        id: 9,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 10,
        label: 'MENUITEMS.APPS.LIST.MANAGERORDERS',
        icon: 'ph ph-shopping-bag-open',
        parentId: 9,
        subItems: [
            {
                id: 12,
                label: 'MENUITEMS.APPS.LIST.LISTORDERS',
                link: '/manage-orders/orders',
                parentId: 10
            },
            {
                id: 13,
                label: 'MENUITEMS.APPS.LIST.PENDINGORDERS',
                link: '/manage-orders/pending-orders',
                parentId: 10
            },
            {
                id: 14,
                label: 'MENUITEMS.APPS.LIST.PROCESSINGORDERS',
                link: '/manage-orders/processing-orders',
                parentId: 10
            },
            {
                id: 15,
                label: 'MENUITEMS.APPS.LIST.DELIVERINGORDERS',
                link: '/manage-orders/delivering-orders',
                parentId: 10
            },
            {
                id: 16,
                label: 'MENUITEMS.APPS.LIST.FAILEDORDERS',
                link: '/manage-orders/failed-orders',
                parentId: 10
            },
            {
                id: 17,
                label: 'MENUITEMS.APPS.LIST.CANCELORDERS',
                link: '/manage-orders/cancel-orders',
                parentId: 10
            },
        ]
    },
    {
        id: 200,
        label: 'MENUITEMS.APPS.LIST.MANAGERINSTOREORDERS',
        icon: 'ph ph-shopping-bag-open',
        parentId: 9,
        subItems: [
            {
                id: 201,
                label: 'MENUITEMS.APPS.LIST.ADDINSTOREORDER',
                link: '/manage-instore-orders/add-instore-order',
                parentId: 20
            },
            {
                id: 202,
                label: 'MENUITEMS.APPS.LIST.LISTINSTOREORDERS',
                link: '/manage-instore-orders/instore-orders',
                parentId: 20
            }
        ]
    },
    {
        id: 20,
        label: 'MENUITEMS.APPS.LIST.INVOICES',
        icon: 'ph-file-text',
        parentId: 9,
        subItems: [
            {
                id: 21,
                label: 'MENUITEMS.APPS.LIST.LISTINVOICES',
                link: '/manage-invoices/invoices',
                parentId: 20
            },
            {
                id: 22,
                label: 'MENUITEMS.APPS.LIST.PAIDINVOICES',
                link: '/purchase-order/list-purchase-order',
                parentId: 20
            },
            {
                id: 23,
                label: 'MENUITEMS.APPS.LIST.UNPAIDINVOICES',
                link: '/purchase-order/list-purchase-order',
                parentId: 20
            },
        ]
    },
    {
        id: 30,
        label: 'MENUITEMS.APPS.LIST.PROMOTION',
        icon: 'ph-ticket',
        parentId: 9,
        subItems: [
            {
                id: 31,
                label: 'MENUITEMS.APPS.LIST.LISTPROMOTIONS',
                link: '/subscriptions/list-promotion',
                parentId: 30
            },
            {
                id: 32,
                label: 'MENUITEMS.APPS.LIST.LISTCOUPONS',
                link: '/subscriptions/list-coupons',
                parentId: 30
            },
        ]
    },
    {
        id: 40,
        label: 'MENUITEMS.APPS.LIST.MANAGERPRODUCTS',
        icon: 'fph ph-stop',
        parentId: 9,
        subItems: [
            {
                id: 41,
                label: 'MENUITEMS.APPS.LIST.LISTPRODUCTS',
                parentId: 20,
                isCollapsed: true,
                link: '/manager-product/products',
            },
            {
                id: 42,
                label: 'MENUITEMS.APPS.LIST.CREATEPRODUCT',
                parentId: 20,
                isCollapsed: true,
                link: '/manager-product/add-product',
            },
        ]
    },
    {
        id: 60,
        label: 'MENUITEMS.APPS.LIST.MANAGERSYSTEMS',
        icon: 'ph ph-stack',
        parentId: 9,
        subItems: [
            {
                id: 61,
                label: 'MENUITEMS.APPS.LIST.MANAGERNEWS',
                link: '/manager-system/list-news',
                parentId: 60
            },
            {
                id: 62,
                label: 'MENUITEMS.APPS.LIST.MANAGERBANNER',
                link: '/manager-system/list-banners',
                parentId: 60
            },
            {
                id: 63,
                label: 'MENUITEMS.APPS.LIST.CATEGORY',
                link: '/manage-categories/categories',
                parentId: 60
            },
            {
                id: 64,
                label: 'MENUITEMS.APPS.LIST.BRANDS',
                parentId: 60,
                isCollapsed: true,
                link: '/manage-brands/brands',
            },
            {
                id: 65,
                label: 'MENUITEMS.APPS.LIST.SHIPPERS',
                parentId: 60,
                isCollapsed: true,
                link: '/manage-shippers/shippers',
            },
        ]
    },
    {
        id: 100,
        label: 'MENUITEMS.APPS.LIST.USERMANAGER',
        icon: 'ph-buildings',
        parentId: 9,
        subItems: [
            {
                id: 101,
                label: 'MENUITEMS.APPS.LIST.CUSTOMERS',
                link: '/manage-users/customers',
                parentId: 100
            },
            {
                id: 102,
                label: 'MENUITEMS.APPS.LIST.STAFFS',
                link: '/manage-users/staffs',
                parentId: 100
            },
        ]
    },
]