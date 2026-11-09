import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell, Disclosure, AppShell, Header, SideNav, SkipToContent, Layer, Grid, Link, InlineLoading } from '../src';

describe('Table', () => {
  it('compound structure with roles and pass-through', () => {
    render(
      <Table density="compact" stickyHeader data-testid="tbl">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>alpha</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const wrap = screen.getByTestId('tbl');
    expect(wrap.querySelector('table')).toHaveClass('pm-table--compact', 'pm-table--sticky-header');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'alpha' })).toBeInTheDocument();
  });

  it('sortable header: aria-sort + onSort', () => {
    const onSort = vi.fn();
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell sort={{ direction: 'ascending', onSort }}>Age</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const th = screen.getByRole('columnheader', { name: /age/i });
    expect(th).toHaveAttribute('aria-sort', 'ascending');
    fireEvent.click(screen.getByRole('button', { name: /age/i }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });
});

describe('Disclosure', () => {
  it('toggles aria-expanded and reveals the region', () => {
    render(
      <Disclosure title="More">
        <p>details</p>
      </Disclosure>,
    );
    const trigger = screen.getByRole('button', { name: /more/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByText('details')).toBeInTheDocument();
  });

  it('controlled open', () => {
    const onOpenChange = vi.fn();
    render(
      <Disclosure title="T" open={false} onOpenChange={onOpenChange}>
        x
      </Disclosure>,
    );
    fireEvent.click(screen.getByRole('button', { name: /t/i }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe('AppShell', () => {
  it('Header menu button opens the SideNav overlay; links carry aria-current', () => {
    render(
      <AppShell>
        <Header productName="brdcrmb" />
        <SideNav
          groups={[
            { heading: 'Work', links: [{ label: 'Dashboard', href: '/', current: true }, { label: 'Agents', href: '/agents' }] },
            { heading: 'This project', links: [{ label: 'Settings', href: '/s' }] },
          ]}
        />
      </AppShell>,
    );
    expect(screen.getByText('brdcrmb')).toBeInTheDocument();
    const menu = screen.getByRole('button', { name: 'Open navigation' });
    fireEvent.click(menu);
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toHaveClass('is-open');
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('This project')).toBeInTheDocument();
    // link click closes the overlay
    fireEvent.click(screen.getByRole('link', { name: 'Agents' }));
    expect(nav).not.toHaveClass('is-open');
  });

  it('router-agnostic linkAs renders the given component', () => {
    const RouterLink = (props: any) => <a data-router {...props} />;
    render(
      <SideNav
        linkAs={RouterLink}
        groups={[{ links: [{ label: 'Home', href: '/' }] }]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-router');
  });

  it('SkipToContent targets the main id', () => {
    render(<SkipToContent targetId="content" />);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#content');
  });
});

describe('Layer', () => {
  it('nested layers take the next surface level', () => {
    render(
      <Layer data-testid="outer">
        <Layer data-testid="inner">
          <Layer data-testid="innermost">x</Layer>
        </Layer>
      </Layer>,
    );
    expect(screen.getByTestId('outer')).toHaveAttribute('data-level', '1');
    expect(screen.getByTestId('inner')).toHaveAttribute('data-level', '2');
    expect(screen.getByTestId('innermost')).toHaveAttribute('data-level', '2'); // clamped
  });
});

describe('Grid', () => {
  it('columns via data attributes (CSS rules, so media queries can override); gap inline', () => {
    const { rerender } = render(
      <Grid columns={3} data-testid="g">
        <div>a</div>
      </Grid>,
    );
    // base columns are a data attribute + CSS rule, NOT an inline style — inline would
    // beat the responsive media-query rules
    expect(screen.getByTestId('g')).toHaveAttribute('data-cols-base', '3');
    expect(screen.getByTestId('g')).not.toHaveStyle({ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' });
    rerender(
      <Grid columns={{ base: 1, md: 2, lg: 4 }} data-testid="g">
        <div>a</div>
      </Grid>,
    );
    const g = screen.getByTestId('g');
    expect(g).toHaveAttribute('data-cols-base', '1');
    expect(g).toHaveAttribute('data-cols-md', '2');
    expect(g).toHaveAttribute('data-cols-lg', '4');
  });
});

describe('Link', () => {
  it('external adds icon + rel/target; polymorphic as', () => {
    render(
      <Link href="https://example.com" external>
        docs
      </Link>,
    );
    const link = screen.getByRole('link', { name: /docs/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link.querySelector('svg')).not.toBeNull();
  });

  it('renders as a custom component (router link)', () => {
    const RouterLink = (props: any) => <a data-router {...props} />;
    render(
      <Link as={RouterLink} href="/x">
        go
      </Link>,
    );
    expect(screen.getByRole('link', { name: 'go' })).toHaveAttribute('data-router');
  });
});

describe('InlineLoading', () => {
  it('states active/finished/error; error is role=alert, the rest role=status', () => {
    const { rerender } = render(<InlineLoading status="active" label="Working" />);
    expect(screen.getByRole('status')).toHaveTextContent('Working');
    rerender(<InlineLoading status="finished" label="Working" finishedLabel="Done" />);
    expect(screen.getByRole('status')).toHaveTextContent('Done');
    rerender(<InlineLoading status="error" label="Working" errorLabel="Failed" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  });
});
