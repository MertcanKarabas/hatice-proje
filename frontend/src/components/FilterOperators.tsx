import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';

const fields = [
    { value: 'name', label: 'Adı', type: 'string' },
    { value: 'sku', label: 'Stok Kodu', type: 'string' },
    { value: 'quantity', label: 'Adet', type: 'number' },
    { value: 'unit', label: 'Birim', type: 'string' },
    { value: 'price', label: 'Fiyat', type: 'number' },
    { value: 'currency', label: 'Döviz', type: 'string' },
];

const stringOperators = [
    { value: 'contains', label: 'İçerir' },
    { value: 'equals', label: 'Eşittir' },
];
const numberOperators = [
    { value: 'equals', label: 'Eşittir' },
    { value: 'gt', label: 'Büyüktür' },
    { value: 'lt', label: 'Küçüktür' },
];

type Props = {
    filter: any;
    setFilter: (f: any) => void;
    onApply: () => void;
};

const ProductFilter: React.FC<Props> = ({ filter, setFilter, onApply }) => {
    const selectedField = fields.find(f => f.value === filter.field);

    const handleFieldChange = (field: string) => {
        const type = fields.find(f => f.value === field)?.type || 'string';
        const operator = type === 'number' ? 'gt' : 'contains';
        setFilter({ field, operator, value: '' });
    };

    return (
        <Box display="flex" alignItems="center" gap={2} mb={2} marginBlock={2}>
            <FormControl>
                <InputLabel>Alan</InputLabel>
                <Select
                    value={filter.field}
                    label="Alan"
                    onChange={(e) => handleFieldChange(e.target.value)}
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
                    {(selectedField?.type === 'number' ? numberOperators : stringOperators).map((op) => (
                        <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Değer"
                value={filter.value}
                type={selectedField?.type === 'number' ? 'number' : 'text'}
                onChange={(e) => setFilter({ ...filter, value: e.target.value })}
                size='small'
            />

            <Button variant="contained" onClick={onApply} sx={{ height: 40 }}>Uygula</Button>
        </Box>
    );
};

export default ProductFilter;
