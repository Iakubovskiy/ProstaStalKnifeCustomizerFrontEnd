import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { DeleteIcon, EditIcon, EyeIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";
import "./style.css";
import { useRouter } from "next/router";

export type Column<T> = {
  name: string;
  uid: keyof T;
};

type CustomTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  onDelete: (id: string, isActive?: boolean) => void;
};

export default function CustomTable<T extends Record<string, any>>({
  data,
  columns,
  onDelete,
}: CustomTableProps<T>) {
  const router = useRouter();
  const renderCell = (item: T, columnKey: keyof T) => {
    const cellValue = item[columnKey];
    if (columnKey === "actions") {
        const isActive = item["isActive"]
        return (
            <div className="flex gap-2">
                <span
                className="cursor-pointer icon"
                onClick={() => router.push(`${router.asPath}/${item.id}`)}
              >
                <EditIcon />
                  </span>
                {isActive !== undefined ? (
                    <span
                        className="cursor-pointer icon"
                        onClick={() => onDelete(item.id, isActive)}
                    >
                    {isActive ? <EyeIcon /> : <EyeSlashFilledIcon />}
                  </span>
                                ) : (
                                    <span
                                        className="cursor-pointer icon"
                                        onClick={() => onDelete(item.id)}
                                    >
                    <DeleteIcon />
                  </span>
                )}
            </div>
        );
    }
    return cellValue;
  };

  const modifiedColumns = [...columns, { name: "Дії", uid: "actions" }];
  console.log("Data = ", data);
  return (
    <Table aria-label="Custom Table" className="custom-table text-black">
      <TableHeader columns={modifiedColumns} className="custom-table">
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
          <TableRow key={item.id} className="table-row">
            {(columnKey) => (
              <TableCell
                className={columnKey === "actions" ? "actions-cell" : ""}
              >
                {renderCell(item, columnKey as keyof T)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
