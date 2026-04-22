import type { Meta, StoryObj } from '@storybook/react';
import { ListPage } from './ListPage';

const meta: Meta<typeof ListPage> = {
  title: 'Components/ListPage',
  component: ListPage,
  parameters: { layout: 'fullscreen' },
};

export default meta;

interface Item {
  id: string;
  name: string;
  category: string;
}

const ITEMS: Item[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i),
  name: `Item ${i + 1}`,
  category: i % 2 === 0 ? 'alpha' : 'beta',
}));

export const Default: StoryObj = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ListPage<Item, string>
        title="Items"
        onAction={() => alert('New item')}
        searchPlaceholder="Search items…"
        emptyLabel="No items found."
        sortOptions={[
          { value: 'name-asc', label: 'Name A→Z', sortBy: 'name', sortDir: 'ASC' },
          { value: 'name-desc', label: 'Name Z→A', sortBy: 'name', sortDir: 'DESC' },
        ]}
        chips={{
          category: [
            { key: 'alpha', label: 'Alpha' },
            { key: 'beta', label: 'Beta' },
          ],
        }}
        fetchFn={async ({ search, filter }) => {
          await new Promise(r => setTimeout(r, 200));
          let data = ITEMS;
          if (search) data = data.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
          if (filter?.category) data = data.filter(i => i.category === filter.category);
          return { data: data.slice(0, 50), total: data.length };
        }}
        renderItem={item => (
          <div
            key={item.id}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--separator)',
              color: 'var(--label-primary)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>{item.name}</span>
            <span style={{ color: 'var(--label-tertiary)', fontSize: '0.85rem' }}>{item.category}</span>
          </div>
        )}
      />
    </div>
  ),
};
