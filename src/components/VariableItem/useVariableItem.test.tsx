import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useVariableItem } from './useVariableItem';
import styles from './VariableItem.module.scss';

describe('useVariableItem Hook', () => {
  const defaultArgs = {
    name: 'testKey',
    value: 'testValue',
    addItemAction: vi.fn(),
  };

  it('initializes with correct values when not editing', () => {
    const { result } = renderHook(() =>
      useVariableItem(
        defaultArgs.name,
        defaultArgs.value,
        defaultArgs.addItemAction
      )
    );
    const [newValue, key, isEditing] = result.current;

    expect(newValue).toBe('testValue');
    expect(key).toBe('testKey');
    expect(isEditing).toBe(false);
  });

  it('initializes in editing mode when value is empty', () => {
    const { result } = renderHook(() =>
      useVariableItem('testKey', '', defaultArgs.addItemAction)
    );
    const [newValue, key, isEditing] = result.current;

    expect(newValue).toBe('');
    expect(key).toBe('testKey');
    expect(isEditing).toBe(true);
  });

  it('updates key and value via setNewValues', () => {
    const { result } = renderHook(() =>
      useVariableItem(
        defaultArgs.name,
        defaultArgs.value,
        defaultArgs.addItemAction
      )
    );
    const [, , , setNewValues] = result.current;

    act(() => {
      setNewValues('key', 'newKey');
      setNewValues('value', 'newValue');
    });

    const [newValue, key, isEditing] = result.current;
    expect(newValue).toBe('newValue');
    expect(key).toBe('newKey');
    expect(isEditing).toBe(true);
  });

  it('calls addItemAction and disables editing on saveVariable', () => {
    const { result } = renderHook(() =>
      useVariableItem(
        defaultArgs.name,
        defaultArgs.value,
        defaultArgs.addItemAction
      )
    );
    const [, , , , saveVariable] = result.current;

    act(() => {
      saveVariable();
    });

    const [, , isEditing] = result.current;
    expect(defaultArgs.addItemAction).toHaveBeenCalledWith(
      'testKey',
      'testValue'
    );
    expect(isEditing).toBe(false);
  });

  it('returns correct styles from getApplyActionStyles', () => {
    const { result } = renderHook(() =>
      useVariableItem(
        defaultArgs.name,
        defaultArgs.value,
        defaultArgs.addItemAction
      )
    );
    const [, , , , , getApplyActionStyles] = result.current;

    expect(getApplyActionStyles()).toBe(styles.invisible);

    act(() => {
      result.current[3]('key', 'newKey');
    });
    expect(getApplyActionStyles()).toBe(styles.invisible);

    const { result: emptyResult } = renderHook(() =>
      useVariableItem('empty-0', '', defaultArgs.addItemAction)
    );
    act(() => {
      emptyResult.current[3]('key', 'newKey');
      emptyResult.current[3]('value', 'newValue');
    });
    expect(emptyResult.current[5]()).toBe(styles.action);

    const { result: missingResult } = renderHook(() =>
      useVariableItem('empty-0', '', defaultArgs.addItemAction)
    );
    expect(missingResult.current[5]()).toBe(styles.disabled);
  });
});
