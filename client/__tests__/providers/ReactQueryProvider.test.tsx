import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

describe('ReactQueryProvider', () => {
  it('rend les children', () => {
    const { getByText } = render(
      <ReactQueryProvider>
        <div>child</div>
      </ReactQueryProvider>,
    );
    expect(getByText('child')).toBeDefined();
  });
});
