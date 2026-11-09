import { forwardRef } from 'react';
import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes, Ref } from 'react';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export type TableDensity = 'normal' | 'compact';

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  density?: TableDensity;
  /** Sticky header row while the table scrolls vertically. */
  stickyHeader?: boolean;
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Sortable column: renders a sort button; th gets aria-sort. */
  sort?: { direction: 'ascending' | 'descending' | null; onSort?: () => void };
}

/** Table — wrapper scrolls sideways inside its container, never the page. */
export const Table = forwardRef(function Table(
  { density = 'normal', stickyHeader = false, className, children, ...rest }: TableProps,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div ref={ref} className={cx('pm-table-wrap', className)} {...rest}>
      <table className={cx('pm-table', `pm-table--${density}`, stickyHeader && 'pm-table--sticky-header')}>{children}</table>
    </div>
  );
});

export const TableHead = forwardRef(function TableHead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>, ref: Ref<HTMLTableSectionElement>) {
  return <thead ref={ref} className={cx('pm-table__head', className)} {...rest} />;
});

export const TableBody = forwardRef(function TableBody({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>, ref: Ref<HTMLTableSectionElement>) {
  return <tbody ref={ref} className={cx('pm-table__body', className)} {...rest} />;
});

export const TableRow = forwardRef(function TableRow({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>, ref: Ref<HTMLTableRowElement>) {
  return <tr ref={ref} className={cx('pm-table__row', className)} {...rest} />;
});

export const TableHeaderCell = forwardRef(function TableHeaderCell(
  { sort, className, children, ...rest }: TableHeaderCellProps,
  ref: Ref<HTMLTableCellElement>,
) {
  return (
    <th
      ref={ref}
      className={cx('pm-table__th', sort && 'pm-table__th--sortable', className)}
      aria-sort={sort ? (sort.direction === null ? 'none' : sort.direction) : undefined}
      {...rest}
    >
      {sort ? (
        <button type="button" className="pm-table__sort" onClick={sort.onSort}>
          {children}
          <Icon name={sort.direction === 'ascending' ? 'chevron-up' : 'chevron-down'} size={14} aria-hidden />
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export const TableCell = forwardRef(function TableCell({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>, ref: Ref<HTMLTableCellElement>) {
  return <td ref={ref} className={cx('pm-table__td', className)} {...rest} />;
});
