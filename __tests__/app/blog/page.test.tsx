import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Blog from '@/app/blog/page';

jest.mock('@portabletext/react', () => ({
  PortableText: ({ value }: { value: Array<{ children?: Array<{ text?: string }> }> }) => {
    const text = (value || [])
      .flatMap((block) => (block.children || []).map((c) => c.text ?? ''))
      .join('');
    return <span>{text}</span>;
  },
}));

const mockBlogResponse = {
  blogPosts: [
    {
      id: 'post-1',
      title: 'Test Post',
      publishedAt: '2025-03-14T12:00:00Z',
      author: { name: 'Kayt', imageUrl: null },
      tags: ['crafts', 'tutorial'],
      content: [
        {
          _type: 'block',
          _key: 'a',
          children: [{ _type: 'span', _key: 'b', text: 'Hello world content.' }],
        },
      ],
      image: 'https://example.com/image.jpg',
      imageCaption: 'A test caption',
    },
  ],
  page: 1,
  pages: 2,
  total: 2,
  perPage: 1,
};

const mockListResponse = {
  posts: [
    {
      id: 'post-1',
      title: 'Test Post',
      publishedAt: '2025-03-14T12:00:00Z',
      author: 'Kayt',
      tags: ['crafts', 'tutorial'],
      excerpt: 'Hello world content.',
      page: 1,
    },
    {
      id: 'post-2',
      title: 'Another Post',
      publishedAt: '2025-03-01T10:00:00Z',
      author: 'Ryan',
      tags: ['news'],
      excerpt: 'Another excerpt.',
      page: 2,
    },
  ],
};

describe('Blog page', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url: string) => {
      if (url.includes('/api/blog/list')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockListResponse) });
      }
      if (url.includes('/api/blog?')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockBlogResponse) });
      }
      return Promise.reject(new Error('Unknown URL'));
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders and loads the current post', async () => {
    render(<Blog />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument();
    });
  });

  it('fetches post from API and displays title, date, content, and tags', async () => {
    render(<Blog />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument();
    });
    expect(screen.getByText(/March 14, 2025/)).toBeInTheDocument();
    expect(screen.getByText('Hello world content.')).toBeInTheDocument();
    const article = screen.getByRole('article');
    expect(article).toHaveTextContent('crafts');
    expect(article).toHaveTextContent('tutorial');
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/blog?page=1'));
  });

  it('fetches list for sidebar and displays archive', async () => {
    render(<Blog />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Test Post' })).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith('/api/blog/list');
    expect(screen.getByRole('button', { name: 'Test Post' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Another Post' })).toBeInTheDocument();
  });

  it('displays search input and tag cloud when list has tags', async () => {
    render(<Blog />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'crafts' })).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText(/search by title, author, keyword, or tag/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tags' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'crafts' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'tutorial' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'news' })).toBeInTheDocument();
  });

  it('clicking a tag filters archive by that tag', async () => {
    render(<Blog />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'news' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'news' }));
    await waitFor(() => {
      expect(screen.getByDisplayValue('news')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Another Post' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Test Post' })).not.toBeInTheDocument();
  });

  it('shows pagination when there are multiple pages', async () => {
    render(<Blog />);
    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('clicking archive post navigates to that page', async () => {
    render(<Blog />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Another Post' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Another Post' }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/blog?page=2'));
    });
  });

  it('displays image with caption when post has image', async () => {
    render(<Blog />);
    await waitFor(() => {
      expect(screen.getByAltText('A test caption')).toBeInTheDocument();
    });
    expect(screen.getByRole('img', { name: 'A test caption' })).toHaveAttribute(
      'src',
      expect.stringContaining('example.com')
    );
    expect(screen.getByText('A test caption')).toBeInTheDocument();
  });
});
