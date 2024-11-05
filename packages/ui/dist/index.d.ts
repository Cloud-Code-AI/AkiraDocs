import * as React$1 from 'react';
import React__default from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as class_variance_authority_dist_types from 'class-variance-authority/dist/types';
import { VariantProps } from 'class-variance-authority';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import * as _radix_ui_react_separator from '@radix-ui/react-separator';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { Article, BlockType, Block } from 'akiradocs-core';
import { ClassValue } from 'clsx';

declare const Accordion: React$1.ForwardRefExoticComponent<(AccordionPrimitive.AccordionSingleProps | AccordionPrimitive.AccordionMultipleProps) & React$1.RefAttributes<HTMLDivElement>>;
declare const AccordionItem: React$1.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const AccordionTrigger: React$1.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const AccordionContent: React$1.ForwardRefExoticComponent<Omit<AccordionPrimitive.AccordionContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

interface AlertProps {
    children: React__default.ReactNode;
    className?: string;
}
declare function Alert({ children, className }: AlertProps): react_jsx_runtime.JSX.Element;
declare function AlertTitle({ children }: {
    children: React__default.ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function AlertDescription({ children }: {
    children: React__default.ReactNode;
}): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
interface ButtonProps extends React$1.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const Button: React$1.ForwardRefExoticComponent<ButtonProps & React$1.RefAttributes<HTMLButtonElement>>;

declare const Card: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardHeader: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardTitle: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLHeadingElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const CardDescription: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLParagraphElement> & React$1.RefAttributes<HTMLParagraphElement>>;
declare const CardContent: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;
declare const CardFooter: React$1.ForwardRefExoticComponent<React$1.HTMLAttributes<HTMLDivElement> & React$1.RefAttributes<HTMLDivElement>>;

declare const Checkbox: React$1.ForwardRefExoticComponent<Omit<CheckboxPrimitive.CheckboxProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

declare const Collapsible: React$1.ForwardRefExoticComponent<CollapsiblePrimitive.CollapsibleProps & React$1.RefAttributes<HTMLDivElement>>;
declare const CollapsibleTrigger: React$1.ForwardRefExoticComponent<CollapsiblePrimitive.CollapsibleTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const CollapsibleContent: React$1.ForwardRefExoticComponent<CollapsiblePrimitive.CollapsibleContentProps & React$1.RefAttributes<HTMLDivElement>>;

declare const DropdownMenu: React$1.FC<DropdownMenuPrimitive.DropdownMenuProps>;
declare const DropdownMenuTrigger: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const DropdownMenuGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuPortal: React$1.FC<DropdownMenuPrimitive.DropdownMenuPortalProps>;
declare const DropdownMenuSub: React$1.FC<DropdownMenuPrimitive.DropdownMenuSubProps>;
declare const DropdownMenuRadioGroup: React$1.ForwardRefExoticComponent<DropdownMenuPrimitive.DropdownMenuRadioGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubTrigger: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubTriggerProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSubContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSubContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuContent: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuCheckboxItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuCheckboxItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuRadioItem: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuRadioItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuLabel: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuSeparator: React$1.ForwardRefExoticComponent<Omit<DropdownMenuPrimitive.DropdownMenuSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const DropdownMenuShortcut: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLSpanElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};

type InputProps = React$1.InputHTMLAttributes<HTMLInputElement>;
declare const Input: React$1.ForwardRefExoticComponent<InputProps & React$1.RefAttributes<HTMLInputElement>>;

declare const Label: React$1.ForwardRefExoticComponent<Omit<LabelPrimitive.LabelProps & React$1.RefAttributes<HTMLLabelElement>, "ref"> & VariantProps<(props?: class_variance_authority_dist_types.ClassProp | undefined) => string> & React$1.RefAttributes<HTMLLabelElement>>;

declare const Popover: React$1.FC<PopoverPrimitive.PopoverProps>;
declare const PopoverTrigger: React$1.ForwardRefExoticComponent<PopoverPrimitive.PopoverTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const PopoverContent: React$1.ForwardRefExoticComponent<Omit<PopoverPrimitive.PopoverContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const ScrollArea: React$1.ForwardRefExoticComponent<Omit<ScrollAreaPrimitive.ScrollAreaProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const ScrollBar: React$1.ForwardRefExoticComponent<Omit<ScrollAreaPrimitive.ScrollAreaScrollbarProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Select: React$1.FC<SelectPrimitive.SelectProps>;
declare const SelectGroup: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectValue: React$1.ForwardRefExoticComponent<SelectPrimitive.SelectValueProps & React$1.RefAttributes<HTMLSpanElement>>;
declare const SelectTrigger: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectTriggerProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SelectScrollUpButton: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollUpButtonProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectScrollDownButton: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectScrollDownButtonProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectContent: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectLabel: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectLabelProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectItem: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectItemProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectSeparator: React$1.ForwardRefExoticComponent<Omit<SelectPrimitive.SelectSeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

declare const Sheet: React$1.FC<SheetPrimitive.DialogProps>;
declare const SheetTrigger: React$1.ForwardRefExoticComponent<SheetPrimitive.DialogTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetClose: React$1.ForwardRefExoticComponent<SheetPrimitive.DialogCloseProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const SheetPortal: React$1.FC<SheetPrimitive.DialogPortalProps>;
declare const SheetOverlay: React$1.ForwardRefExoticComponent<Omit<SheetPrimitive.DialogOverlayProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const sheetVariants: (props?: ({
    side?: "top" | "right" | "bottom" | "left" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string;
interface SheetContentProps extends React$1.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {
}
declare const SheetContent: React$1.ForwardRefExoticComponent<SheetContentProps & React$1.RefAttributes<HTMLDivElement>>;
declare const SheetHeader: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const SheetFooter: {
    ({ className, ...props }: React$1.HTMLAttributes<HTMLDivElement>): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const SheetTitle: React$1.ForwardRefExoticComponent<Omit<SheetPrimitive.DialogTitleProps & React$1.RefAttributes<HTMLHeadingElement>, "ref"> & React$1.RefAttributes<HTMLHeadingElement>>;
declare const SheetDescription: React$1.ForwardRefExoticComponent<Omit<SheetPrimitive.DialogDescriptionProps & React$1.RefAttributes<HTMLParagraphElement>, "ref"> & React$1.RefAttributes<HTMLParagraphElement>>;

declare const TooltipProvider: React$1.FC<TooltipPrimitive.TooltipProviderProps>;
declare const Tooltip: React$1.FC<TooltipPrimitive.TooltipProps>;
declare const TooltipTrigger: React$1.ForwardRefExoticComponent<TooltipPrimitive.TooltipTriggerProps & React$1.RefAttributes<HTMLButtonElement>>;
declare const TooltipContent: React$1.ForwardRefExoticComponent<Omit<TooltipPrimitive.TooltipContentProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;

type SidebarContext = {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};
declare const SidebarContext: React$1.Context<SidebarContext | null>;
declare function useSidebar(): SidebarContext;
declare const SidebarProvider: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLDivElement> & React$1.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const Sidebar: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLDivElement> & React$1.HTMLAttributes<HTMLDivElement> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
}, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarTrigger: React$1.ForwardRefExoticComponent<Omit<ButtonProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarRail: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarInset: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarInput: React$1.ForwardRefExoticComponent<Omit<InputProps & React$1.RefAttributes<HTMLInputElement>, "ref"> & React$1.RefAttributes<HTMLInputElement>>;
declare const SidebarHeader: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarFooter: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarSeparator: React$1.ForwardRefExoticComponent<Omit<Omit<_radix_ui_react_separator.SeparatorProps & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarContent: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarGroup: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarGroupLabel: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLDivElement> & React$1.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarGroupAction: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLButtonElement> & React$1.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarGroupContent: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarMenu: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref"> & React$1.RefAttributes<HTMLUListElement>>;
declare const SidebarMenuItem: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$1.RefAttributes<HTMLLIElement>>;
declare const SidebarMenuButton: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLButtonElement> & React$1.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React$1.ComponentProps<typeof TooltipContent>;
} & VariantProps<(props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_dist_types.ClassProp) | undefined) => string>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarMenuAction: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLButtonElement> & React$1.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
    showOnHover?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;
declare const SidebarMenuBadge: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarMenuSkeleton: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLDivElement> & React$1.HTMLAttributes<HTMLDivElement> & {
    showIcon?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLDivElement>>;
declare const SidebarMenuSub: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref"> & React$1.RefAttributes<HTMLUListElement>>;
declare const SidebarMenuSubItem: React$1.ForwardRefExoticComponent<Omit<React$1.DetailedHTMLProps<React$1.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React$1.RefAttributes<HTMLLIElement>>;
declare const SidebarMenuSubButton: React$1.ForwardRefExoticComponent<Omit<React$1.ClassAttributes<HTMLAnchorElement> & React$1.AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
}, "ref"> & React$1.RefAttributes<HTMLAnchorElement>>;

declare const Switch: React$1.ForwardRefExoticComponent<Omit<SwitchPrimitives.SwitchProps & React$1.RefAttributes<HTMLButtonElement>, "ref"> & React$1.RefAttributes<HTMLButtonElement>>;

type TextareaProps = React$1.TextareaHTMLAttributes<HTMLTextAreaElement>;
declare const Textarea: React$1.ForwardRefExoticComponent<TextareaProps & React$1.RefAttributes<HTMLTextAreaElement>>;

declare function ThemeProvider({ children, ...props }: ThemeProviderProps): react_jsx_runtime.JSX.Element;

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    noIndex?: boolean;
    author?: string;
    publishDate?: string;
    modifiedDate?: string;
    category?: string;
    keywords?: string[];
}
declare function SEO({ title, description, canonical, ogImage, noIndex, author, publishDate, modifiedDate, category, keywords }: SEOProps): react_jsx_runtime.JSX.Element;

interface SearchBarProps {
    query: string;
    onQueryChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}
declare function SearchBar({ query, onQueryChange, onSubmit }: SearchBarProps): react_jsx_runtime.JSX.Element;

interface SearchHeaderProps {
    logo?: {
        path: string;
        width: number;
        height: number;
        show: boolean;
    };
    title?: {
        text: string;
        show: boolean;
    };
    description?: {
        text: string;
        show: boolean;
    };
}
declare function SearchHeader({ logo, title, description }: SearchHeaderProps): react_jsx_runtime.JSX.Element;

declare function LegacyDocsToggle(): react_jsx_runtime.JSX.Element;

interface Source {
    title: string;
    url: string;
}
interface AIResponseProps {
    response: string;
    sources: Source[];
    onBack: () => void;
}
declare function AIResponse({ response, sources, onBack }: AIResponseProps): react_jsx_runtime.JSX.Element;

interface RecommendedArticlesProps {
    articles: Article[];
}
declare function RecommendedArticles({ articles }: RecommendedArticlesProps): react_jsx_runtime.JSX.Element;

interface ArticleHeadersProps {
    title: string;
    setTitle: (title: string) => void;
    subtitle: string;
    setSubtitle: (subtitle: string) => void;
    showPreview: boolean;
}
declare function ArticleHeaders({ title, setTitle, subtitle, setSubtitle, showPreview }: ArticleHeadersProps): react_jsx_runtime.JSX.Element;

interface TitleBarProps {
    showPreview: boolean;
    setShowPreview: (show: boolean) => void;
    onSave: () => void;
    isSaving?: boolean;
}
declare function TitleBar({ showPreview, setShowPreview, onSave, isSaving }: TitleBarProps): react_jsx_runtime.JSX.Element;

interface SortableBlockProps {
    block: {
        id: string;
        type: BlockType;
        content: string;
    };
    updateBlock: (id: string, content: string) => void;
    changeBlockType: (id: string, newType: BlockType) => void;
    addBlock: (afterId: string) => void;
    deleteBlock: (id: string) => void;
    showPreview: boolean;
    isChangeTypeActive: boolean;
    setActiveChangeTypeId: (id: string | null) => void;
}
declare function SortableBlock({ block, updateBlock, changeBlockType, addBlock, deleteBlock, showPreview, isChangeTypeActive, setActiveChangeTypeId }: SortableBlockProps): react_jsx_runtime.JSX.Element;

interface AddBlockButtonProps {
    onAddBlock?: (type: BlockType) => void;
    onChangeType?: (type: BlockType) => void;
    mode: 'add' | 'change';
    isActive?: boolean;
    onOpenChange?: (open: boolean) => void;
    type?: BlockType;
    open?: boolean;
}
declare const AddBlockButton: React__default.ForwardRefExoticComponent<AddBlockButtonProps & React__default.RefAttributes<HTMLButtonElement>>;

interface AudioProps {
    id?: string;
    src: string;
    caption?: string;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function Audio({ id, src, caption, align, styles }: AudioProps): react_jsx_runtime.JSX.Element;

interface BlockquoteProps {
    id?: string;
    children: React__default.ReactNode;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function Blockquote({ id, children, align, styles }: BlockquoteProps): react_jsx_runtime.JSX.Element;

type CalloutType = 'info' | 'warning' | 'success' | 'error';
interface CalloutProps {
    id?: string;
    type: CalloutType;
    title?: string;
    children: React.ReactNode;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function Callout({ id, type, title, children, align, styles }: CalloutProps): react_jsx_runtime.JSX.Element;

interface CheckListProps {
    id?: string;
    items: {
        text: string;
        checked: boolean;
    }[];
    align?: 'left' | 'center' | 'right';
}
declare function CheckList({ id, items, align }: CheckListProps): react_jsx_runtime.JSX.Element;

interface CodeBlockProps {
    id?: string;
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
    align?: 'left' | 'center' | 'right';
}
declare function CodeBlock({ id, code, language, filename, showLineNumbers, align }: CodeBlockProps): react_jsx_runtime.JSX.Element;

interface DividerProps {
    id?: string;
    align?: 'left' | 'center' | 'right';
}
declare function Divider({ id, align }: DividerProps): react_jsx_runtime.JSX.Element;

interface EmojiProps {
    id?: string;
    symbol: string;
    label?: string;
    align?: 'left' | 'center' | 'right';
}
declare function Emoji({ id, symbol, label, align }: EmojiProps): react_jsx_runtime.JSX.Element;

interface FileProps {
    id?: string;
    url: string;
    name: string;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function File({ id, url, name, align, styles }: FileProps): react_jsx_runtime.JSX.Element;

interface HeadingProps {
    id?: string;
    level: number;
    children: React__default.ReactNode;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function Heading({ id, level, children, align, styles }: HeadingProps): react_jsx_runtime.JSX.Element;
interface MainTitleProps {
    id?: string;
    children: React__default.ReactNode;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function MainTitle({ id, children, align, styles }: MainTitleProps): react_jsx_runtime.JSX.Element;
interface SubTitleProps {
    id?: string;
    children: React__default.ReactNode;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function SubTitle({ id, children, align, styles }: SubTitleProps): react_jsx_runtime.JSX.Element;

interface ImageBlockProps {
    id?: string;
    src: string;
    alt: string;
    caption?: string;
    size?: 'small' | 'medium' | 'large' | 'full';
    position?: 'left' | 'center' | 'right';
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function Image({ id, src, alt, caption, size, position, align, styles }: ImageBlockProps): react_jsx_runtime.JSX.Element;

interface ListProps {
    id?: string;
    items: string[];
    ordered?: boolean;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function List({ id, items, ordered, align, styles }: ListProps): react_jsx_runtime.JSX.Element;

interface ParagraphProps {
    id?: string;
    children: React__default.ReactNode;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function Paragraph({ id, children, align, styles }: ParagraphProps): react_jsx_runtime.JSX.Element;

interface TableProps {
    id?: string;
    headers: string[];
    rows: string[][];
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function Table({ id, headers, rows, align, styles }: TableProps): react_jsx_runtime.JSX.Element;

interface ToggleListProps {
    id?: string;
    items: {
        title: string;
        content: string;
    }[];
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function ToggleList({ id, items, align, styles }: ToggleListProps): react_jsx_runtime.JSX.Element;

interface VideoProps {
    id?: string;
    src: string;
    caption?: string;
    align?: 'left' | 'center' | 'right';
    styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    };
}
declare function Video({ id, src, caption, align, styles }: VideoProps): react_jsx_runtime.JSX.Element;

interface BreadcrumbProps {
    type: string;
    slug: string;
}
declare function PageBreadcrumb({ type, slug }: BreadcrumbProps): react_jsx_runtime.JSX.Element;

interface NavItem$1 {
    label: string;
    href: string;
    icon?: string;
}
interface SocialLink {
    name: string;
    url: string;
    icon: string;
}
interface HeaderProps {
    logo?: {
        path: string;
        width: number;
        height: number;
    };
    title?: {
        text: string;
        show: boolean;
    };
    navItems?: NavItem$1[];
    showSearch?: boolean;
    searchPlaceholder?: string;
    socialLinks?: SocialLink[];
}
declare function Header({ logo, title, navItems, showSearch, searchPlaceholder, socialLinks, }: HeaderProps): react_jsx_runtime.JSX.Element;

interface NavigationSidebarProps {
    items: Record<string, NavItem>;
}
declare function Navigation({ items }: NavigationSidebarProps): react_jsx_runtime.JSX.Element;
interface NavItemProps {
    item: NavItem;
    pathname: string;
    depth?: number;
}
type NavItem = {
    title: string;
    path?: string;
    badge?: string;
    items?: Record<string, NavItem>;
};
declare const NavItem: React__default.FC<NavItemProps>;

interface PageNavigationProps {
    prev: {
        title: string;
        path: string;
    } | null;
    next: {
        title: string;
        path: string;
    } | null;
}
declare function PageNavigation({ prev, next }: PageNavigationProps): react_jsx_runtime.JSX.Element;

interface TableOfContentsProps {
    publishDate?: string;
    modifiedDate?: string;
    author?: string;
}
declare function TableOfContents({ publishDate, modifiedDate, author }: TableOfContentsProps): react_jsx_runtime.JSX.Element;

interface BlockRendererProps {
    block: Block;
}
declare function BlockRenderer({ block }: BlockRendererProps): react_jsx_runtime.JSX.Element | null;

declare function cn(...inputs: ClassValue[]): string;

export { AIResponse, Accordion, AccordionContent, AccordionItem, AccordionTrigger, AddBlockButton, Alert, AlertDescription, AlertTitle, ArticleHeaders, Audio, BlockRenderer, Blockquote, Button, type ButtonProps, Callout, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CheckList, Checkbox, CodeBlock, Collapsible, CollapsibleContent, CollapsibleTrigger, Divider, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, Emoji, File, Header, Heading, Image, Input, type InputProps, Label, LegacyDocsToggle, List, MainTitle, Navigation, PageBreadcrumb, PageNavigation, Paragraph, Popover, PopoverContent, PopoverTrigger, RecommendedArticles, SEO, ScrollArea, ScrollBar, SearchBar, SearchHeader, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetOverlay, SheetPortal, SheetTitle, SheetTrigger, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, SortableBlock, SubTitle, Switch, Table, TableOfContents, Textarea, type TextareaProps, ThemeProvider, TitleBar, ToggleList, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Video, buttonVariants, cn, useSidebar };
