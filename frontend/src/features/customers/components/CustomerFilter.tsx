import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button, type SelectChangeEvent } from '@mui/material';

const fields = [
    { value: 'commercialTitle', label: 'Ticari Ünvan', type: 'string' },
    { value: 'email', label: 'Email', type: 'string' },
    { value: 'phone', label: 'Telefon', type: 'string' },
    { value: 'taxNumber', label: 'Vergi No', type: 'string' },
    { value: 'type', label: 'Tip', type: 'enum', options: ['SALES', 'PURCHASE'] },
];

const stringOperators = [
    { value: 'contains', label: 'İçerir' },
    { value: 'equals', label: 'Eşittir' },
];

const enumOperators = [
    { value: 'equals', label: 'Eşittir' },
];

interface Filter {
    field: string;
    operator: string;
    value: string;
}

interface Props {
    filter: Filter;
    setFilter: (f: Filter) => void;
    onApply: () => void;
}

const CustomerFilter: React.FC<Props> = ({ filter, setFilter, onApply }) => {
    const handleFieldChange = (event: SelectChangeEvent<string>) => {
        const field = event.target.value;
        const selectedField = fields.find(f => f.value === field);
        if (selectedField?.type === 'enum') {
            setFilter({ field, operator: 'equals', value: '' });
        } else {
            setFilter({ field, operator: 'contains', value: '' });
        }
    };

    const selectedField = fields.find(f => f.value === filter.field);

    return (
        <Box display="flex" alignItems="center" gap={2} mb={2} marginBlock={2}>
            <FormControl>
                <InputLabel>Alan</InputLabel>
                <Select
                    value={filter.field}
                    label="Alan"
                    onChange={handleFieldChange}
                    size='small'
                    sx={{ width: 200 }}
                >
                    {fields.map((f) => (
                        <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel>Operatör</InputLabel>
                <Select
                    value={filter.operator}
                    label="Operatör"
                    onChange={(e) => setFilter({ ...filter, operator: e.target.value })}
                    size='small'
                    sx={{ width: 200 }}
                >
                    {(selectedField?.type === 'enum' ? enumOperators : stringOperators).map((op) => (
                        <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedField?.type === 'enum' ? (
                <FormControl>
                    <InputLabel>Değer</InputLabel>
                    <Select
                        value={filter.value}
                        label="Değer"
                        onChange={(e) => setFilter({ ...filter, value: e.target.value })}
                        size='small'
                        sx={{ width: 200 }}
                    >
                        {selectedField.options?.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <TextField
                    label="Değer"
                    value={filter.value}
                    onChange={(e) => setFilter({ ...filter, value: e.target.value })}
                    size='small'
                />
            )}

            <Button variant="contained" onClick={onApply} sx={{ height: 40 }}>Uygula</Button>
        </Box>
    );
};

export default CustomerFilter;
