import React from "react";

interface CommonProps {
  children?: React.ReactNode;
  className?: string;
}

export const Table: React.FC<CommonProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="min-w-full">{children}</table>
    </div>
  );
};

export const TableHeader: React.FC<CommonProps> = ({
  children,
  className = "",
}) => <thead className={className}>{children}</thead>;

export const TableBody: React.FC<CommonProps> = ({
  children,
  className = "",
}) => <tbody className={className}>{children}</tbody>;

interface TableRowProps extends CommonProps {
  onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "",
}) => <tr className={className}>{children}</tr>;

interface TableCellProps extends CommonProps {
  isHeader?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className = "",
}) => {
  if (isHeader) {
    return <th className={className}>{children}</th>;
  }
  return <td className={className}>{children}</td>;
};

export default Table;
