export type NavItem = {
    title: string;
    path?: string;
    items?: Record<string, NavItem>;
    badge?: string;
    show?: boolean;
}


export interface NavigationProps {
    locale: string;
    items: Record<string, NavItem>;
}

export interface NavItemProps {
    locale: string;
    item: NavItem;
    pathname: string;
    depth?: number;
}