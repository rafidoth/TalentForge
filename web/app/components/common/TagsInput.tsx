import { useState } from 'react';
import { Combobox, PillsInput, Pill, useCombobox, Loader } from '@mantine/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTags, createTag } from '../../api/tags';
import type { TagDto } from '../../api/types';

interface TagsInputProps {
    selectedTagsList: TagDto[];
    setSelectedTagsList: (val: TagDto[]) => void;
    initialTags?: TagDto[];
    label?: string;
    placeholder?: string;
    error?: React.ReactNode;
}

export function TagsInput({ selectedTagsList, setSelectedTagsList, initialTags = [], label, placeholder, error }: TagsInputProps) {
    const queryClient = useQueryClient();
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = useState('');

    const handleTagsChange = (newTags: TagDto[]) => {
        setSelectedTagsList(newTags);
    };

    const { data: tags = [], isLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: getTags,
    });

    const createTagMutation = useMutation({
        mutationFn: createTag,
        onSuccess: (newTag) => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            handleTagsChange([...selectedTagsList, newTag]);
            setSearch('');
            combobox.closeDropdown();
        },
        onError: (err) => {
            console.error("Failed to create tag", err);
        }
    });

    const handleValueSelect = (val: string) => {
        if (val === '$create') {
            createTagMutation.mutate(search.trim());
        } else {
            const selectedTag = tags.find((t) => t.id === val);
            if (selectedTag) {
                const isSelected = selectedTagsList.some((t) => t.id === val);
                if (!isSelected) {
                    handleTagsChange([...selectedTagsList, selectedTag]);
                }
            }
            setSearch('');
        }
    };

    const handleValueRemove = (val: string) => {
        handleTagsChange(selectedTagsList.filter((v) => v.id !== val));
    };

    const values = selectedTagsList.map((item) => (
        <Pill key={item.id} withRemoveButton onRemove={() => handleValueRemove(item.id)}>
            {item.name}
        </Pill>
    ));

    const exactMatch = tags.some((item) => item.name.toLowerCase() === search.trim().toLowerCase());

    const options = tags
        .filter((item) => !selectedTagsList.some((v) => v.id === item.id))
        .filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()))
        .map((item) => (
            <Combobox.Option value={item.id} key={item.id}>
                {item.name}
            </Combobox.Option>
        ));

    if (search.trim().length > 0 && !exactMatch && !isLoading) {
        options.push(
            <Combobox.Option value="$create" key="$create">
                + Create "{search.trim()}"
            </Combobox.Option>
        );
    }

    const isProcessing = isLoading || createTagMutation.isPending;

    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
            <Combobox.DropdownTarget>
                <PillsInput
                    label={label}
                    error={error}
                    onClick={() => combobox.openDropdown()}
                    rightSection={isProcessing ? <Loader size="xs" /> : null}
                    radius="sm"
                >
                    <Pill.Group>
                        {values}
                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                value={search}
                                placeholder={placeholder}
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearch(event.currentTarget.value);
                                    if (!combobox.dropdownOpened) {
                                        combobox.openDropdown();
                                    }
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && search.length === 0) {
                                        event.preventDefault();
                                        if (selectedTagsList.length > 0) {
                                            handleValueRemove(selectedTagsList[selectedTagsList.length - 1].id);
                                        }
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
                <Combobox.Options>
                    {isLoading ? (
                        <Combobox.Empty>Loading tags...</Combobox.Empty>
                    ) : options.length > 0 ? (
                        options
                    ) : search.trim().length > 0 ? (
                        <Combobox.Empty>Nothing found</Combobox.Empty>
                    ) : (
                        <Combobox.Empty>Type to search tags</Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
