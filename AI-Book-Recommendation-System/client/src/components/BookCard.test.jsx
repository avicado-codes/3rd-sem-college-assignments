// client/src/components/BookCard.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BookCard from './BookCard';

describe('BookCard component', () => {
  it('renders book details correctly', () => {
    const mockBook = {
      title: 'Dune',
      author: 'Frank Herbert',
      reasoning: 'A classic of science fiction.',
      foryoubecause: 'It explores complex themes.',
    };

    render(<BookCard book={mockBook} />);

    // Check if the title is rendered
    expect(screen.getByText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    
    // Check if the author is rendered
    expect(screen.getByText(/Author:/i)).toBeInTheDocument();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();

    // Check if the reasoning is rendered
    expect(screen.getByText(mockBook.reasoning)).toBeInTheDocument();
  });
});