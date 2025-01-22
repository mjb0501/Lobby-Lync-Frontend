import { render, screen, fireEvent,  waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GameSearch } from '../components/gameSearchBar';
//import { useDebounce } from '../hooks/debounce';
import { autocompleteGames } from '../services/gameServices';

vi.mock('../services/gameServices', async () => ({
    autocompleteGames: vi.fn(() => Promise.resolve(["game-1", "game-2"]),
)}));

vi.mock('../hooks/debounce', () => ({
    useDebounce: (fn: () => void) => fn,
}));

describe('GameSearch Component', () => {
    it('renders the input field', () => {
        const mockFilterByGame = vi.fn();
        render(<GameSearch filterByGame={mockFilterByGame} />);

        const inputElement = screen.getByPlaceholderText('Search for a game');
        expect(inputElement).toBeInTheDocument();
    });

    it('calls fetchGames when input changes', async () => {
        const mockFilterByGame = vi.fn();
        
        render(<GameSearch filterByGame={mockFilterByGame} />);

        const inputElement = screen.getByPlaceholderText('Search for a game');

        fireEvent.change(inputElement, { target: { value: 'Mario' } });
        
        expect(inputElement).toHaveValue('Mario');

        await waitFor(() => expect(autocompleteGames).toHaveBeenCalledWith('Mario'))
    });

    it('shows suggestions when games are fetched', async () => {
        const mockFilterByGame = vi.fn();
        
        render(<GameSearch filterByGame={mockFilterByGame} />);

        const inputElement = screen.getByPlaceholderText('Search for a game');

        fireEvent.focus(inputElement);
        
        fireEvent.change(inputElement, { target: { value: 'Mario' } });

        await waitFor(() => {
            expect(screen.getByText('game-1')).toBeInTheDocument();
            expect(screen.getByText('game-2')).toBeInTheDocument();
        })
    });

    it('calls filterByGame when a game is clicked', async () => {
        const mockFilterByGame = vi.fn();

        render(<GameSearch filterByGame={mockFilterByGame} />);

        const inputElement = screen.getByPlaceholderText('Search for a game');

        fireEvent.focus(inputElement);
        fireEvent.change(inputElement, { target: { value: 'Mario' } });

        await waitFor(() => {
            expect(screen.getByText('game-1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('game-1'));

        expect(mockFilterByGame).toHaveBeenCalledWith('game-1');
        expect(inputElement).toHaveValue('');
    });

    it('clears suggestions when input is cleared', async () => {
        const mockFilterByGame = vi.fn();

        render(<GameSearch filterByGame={mockFilterByGame} />);

        const inputElement = screen.getByPlaceholderText('Search for a game');

        fireEvent.focus(inputElement);
        fireEvent.change(inputElement, { target: { value: 'Mario' } });

        await waitFor(() => {
            expect(screen.getByText('game-1')).toBeInTheDocument();
        });

        fireEvent.change(inputElement, { target: { value: '' } });

        await waitFor(() => {
            //have to run queryby because getby will throw an error whereas queryby will only return null
            expect(screen.queryByText('game-1')).not.toBeInTheDocument();
        })
    })
});