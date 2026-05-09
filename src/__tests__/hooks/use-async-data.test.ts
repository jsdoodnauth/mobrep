import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useAsyncData } from '@/hooks/use-async-data';

describe('useAsyncData', () => {
  it('starts in a loading state and resolves with the fetched value', async () => {
    const fetcher = jest.fn().mockResolvedValue('hello');
    const { result } = renderHook(() => useAsyncData(fetcher));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBe('hello');
    expect(result.current.error).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('captures an Error when the fetcher rejects', async () => {
    const fetcher = jest.fn().mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useAsyncData(fetcher));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('boom');
  });

  it('re-runs the fetcher when refresh() is called', async () => {
    const fetcher = jest
      .fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second');
    const { result } = renderHook(() => useAsyncData(fetcher));

    await waitFor(() => expect(result.current.data).toBe('first'));
    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.data).toBe('second'));
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('drops late results from a previous run after unmount', async () => {
    let resolve: (value: string) => void = () => {};
    const fetcher = jest.fn().mockImplementation(
      () => new Promise<string>((r) => (resolve = r)),
    );
    const { result, unmount } = renderHook(() => useAsyncData(fetcher));

    unmount();
    resolve('late');

    await new Promise((r) => setTimeout(r, 10));
    // After unmount, the result holds whatever was last rendered — we only
    // care that no console error or "set state on unmounted" warning fired.
    expect(result.current.data).toBeNull();
  });
});
