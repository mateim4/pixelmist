import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ActivityMarker,
  AgentChip,
  HoverCard,
  Legend,
  Composer,
  Markdown,
  Message,
  PermissionPrompt,
  PlanList,
  SessionListItem,
  Tag,
} from '../src';

describe('ActivityMarker / AgentChip', () => {
  it('states with accessible labels', () => {
    const { rerender } = render(<ActivityMarker state="working" />);
    expect(screen.getByRole('img', { name: 'Working' })).toHaveAttribute('data-state', 'working');
    rerender(<ActivityMarker state="idle" />);
    expect(screen.getByRole('img', { name: 'Idle' })).toHaveAttribute('data-state', 'idle');
    rerender(<ActivityMarker state="stopped" />);
    expect(screen.getByRole('img', { name: 'Stopped' })).toHaveAttribute('data-state', 'stopped');
  });

  it('AgentChip renders name, colour dot and marker', () => {
    render(<AgentChip name="atlas" color={2} state="working" />);
    const chip = screen.getByText('atlas').closest('.pm-agent-chip')!;
    expect(chip.querySelector('.pm-marker')).toHaveAttribute('data-state', 'working');
    expect(chip.querySelector('.pm-agent-chip__dot')).toHaveStyle({ backgroundColor: 'var(--pm-color-dataviz-categorical-2)' });
  });
});

describe('HoverCard', () => {
  it('opens on keyboard focus of the trigger with rich content', () => {
    render(
      <HoverCard
        title="Run 42"
        status={<Tag tone="progress">running</Tag>}
        facts="criteria 2 of 3 met"
        agent={<AgentChip name="atlas" color={0} state="working" />}
      >
        <g tabIndex={0} data-testid="node">
          <circle r="6" />
        </g>
      </HoverCard>,
    );
    const node = screen.getByTestId('node');
    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.focus(node);
    const card = screen.getByRole('tooltip');
    expect(card).toHaveTextContent('Run 42');
    expect(card).toHaveTextContent('criteria 2 of 3 met');
    expect(card).toHaveTextContent('atlas');
    expect(node).toHaveAttribute('aria-describedby', card.id);
  });
});

describe('Legend', () => {
  it('horizontal and vertical with swatches', () => {
    const { rerender } = render(
      <Legend
        items={[
          { label: 'atlas', color: 0 },
          { label: 'vega', color: '#FF0000' },
        ]}
      />,
    );
    expect(screen.getByRole('list')).toHaveClass('pm-legend--horizontal');
    expect(screen.getByText('atlas')).toBeInTheDocument();
    rerender(
      <Legend direction="vertical" items={[{ label: 'atlas', color: 0 }]} />,
    );
    expect(screen.getByRole('list')).toHaveClass('pm-legend--vertical');
  });
});

describe('Composer', () => {
  it('Enter sends, Shift+Enter does not', () => {
    const onSend = vi.fn();
    render(<Composer defaultValue="hello" onSend={onSend} />);
    const ta = screen.getByRole('textbox');
    fireEvent.keyDown(ta, { key: 'Enter', shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it('running turns Send into Stop; disabled blocks send', () => {
    const onStop = vi.fn();
    const onSend = vi.fn();
    const { rerender } = render(<Composer defaultValue="hi" onSend={onSend} running onStop={onStop} />);
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
    expect(onStop).toHaveBeenCalledTimes(1);
    rerender(<Composer defaultValue="hi" onSend={onSend} disabled />);
    const send = screen.getByRole('button', { name: 'Send' });
    expect(send).toBeDisabled();
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
  });

  it('attachment slot', () => {
    const onAttach = vi.fn();
    render(<Composer onAttach={onAttach} />);
    fireEvent.click(screen.getByRole('button', { name: 'Attach file' }));
    expect(onAttach).toHaveBeenCalledTimes(1);
  });
});

describe('Markdown', () => {
  it('renders code blocks, lists, links, inline code — and never raw HTML', () => {
    const src = [
      'Hello **world** and `code`',
      '',
      '- one',
      '- two',
      '',
      '[site](https://example.com)',
      '',
      '```ts',
      'const x = 1;',
      '```',
      '',
      '<script>alert(1)</script>',
    ].join('\n');
    const { container } = render(<Markdown source={src} />);
    expect(container.querySelector('strong')).toHaveTextContent('world');
    expect(container.querySelector('code.pm-md__code')).toHaveTextContent('code');
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'site' })).toHaveAttribute('href', 'https://example.com');
    expect(container.querySelector('.pm-codeblock')).toHaveTextContent('const x = 1;');
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('<script>alert(1)</script>'); // escaped as text
  });

  it('Message renders markdown when markdown=true', () => {
    const { container } = render(
      <Message role="assistant" markdown>
        {'Here is `code` and:\n\n- a\n- b'}
      </Message>,
    );
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelector('code.pm-md__code')).toHaveTextContent('code');
  });
});

describe('PermissionPrompt', () => {
  it('three actions fire their handlers', () => {
    const allowOnce = vi.fn();
    const always = vi.fn();
    const deny = vi.fn();
    render(
      <PermissionPrompt action="run `cargo test`" onAllowOnce={allowOnce} onAlwaysAllow={always} onDeny={deny} />,
    );
    expect(screen.getByText('run `cargo test`')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Allow once' }));
    fireEvent.click(screen.getByRole('button', { name: 'Always allow' }));
    fireEvent.click(screen.getByRole('button', { name: 'Deny' }));
    expect(allowOnce).toHaveBeenCalledTimes(1);
    expect(always).toHaveBeenCalledTimes(1);
    expect(deny).toHaveBeenCalledTimes(1);
  });
});

describe('PlanList', () => {
  it('renders steps with statuses and accessible labels', () => {
    render(
      <PlanList
        steps={[
          { label: 'Scan repo', status: 'done' },
          { label: 'Resolve conflicts', status: 'inProgress' },
          { label: 'Write report', status: 'pending' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveAttribute('data-status', 'done');
    expect(items[0]).toHaveAttribute('aria-label', 'Done');
    expect(items[1]).toHaveAttribute('data-status', 'inProgress');
    expect(items[2]).toHaveAttribute('data-status', 'pending');
  });
});

describe('SessionListItem', () => {
  it('title, project, work item, marker, last active', () => {
    render(
      <SessionListItem
        title="Morning sync"
        project="brdcrmb"
        workItem={<a href="/w/1">BRD-12</a>}
        state="working"
        lastActive="2m ago"
      />,
    );
    expect(screen.getByText('Morning sync')).toBeInTheDocument();
    expect(screen.getByText('brdcrmb')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'BRD-12' })).toHaveAttribute('href', '/w/1');
    expect(screen.getByRole('img', { name: 'Working' })).toBeInTheDocument();
    expect(screen.getByText('2m ago')).toBeInTheDocument();
  });
});
