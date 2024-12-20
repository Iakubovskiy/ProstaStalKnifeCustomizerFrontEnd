import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
} from "@nextui-org/react";
import { DeleteIcon, EditIcon } from "@nextui-org/shared-icons";
import {router} from "next/client";

export type Column<T> = {
    name: string;
    uid: keyof T;
};

type CustomTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    onDelete: (id: number) =>void;
};

export default function CustomTable<T extends Record<string, any>>({
                                                                       data,
                                                                       columns,
                                                                       onDelete
                                                                   }: CustomTableProps<T>) {
    const renderCell = (item: T, columnKey: keyof T) => {
        const cellValue = item[columnKey];
        if (columnKey === "actions") {
            return (
                <div className="flex gap-2">
                    <Tooltip content="Редагувати">
                        <span
                            className="cursor-pointer"
                            onClick={() => router.push(`/edit/${item.id}`)}
                        >
                            <EditIcon />
                        </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Видалити">
                        <span className="cursor-pointer"
                              onClick={() => onDelete(item.id)}>
                            <DeleteIcon />
                        </span>
                    </Tooltip>
                </div>
            );
        }
        return cellValue;
    };

    const modifiedColumns = [...columns, { name: "Actions", uid: "actions" }];
    return (
        <Table aria-label="Custom Table">
            <TableHeader columns={modifiedColumns}>
                {(column) => (
                    <TableColumn
                        key={String(column.uid)}
                        align={column.uid === "actions" ? "center" : "start"}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={data}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey as keyof T)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
