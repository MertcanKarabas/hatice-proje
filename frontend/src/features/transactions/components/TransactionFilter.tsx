import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button, type SelectChangeEvent } from '@mui/material';
import { localizeTransactionType } from '../services/localization.service';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { tr } from 'date-fns/locale';
import { DatePicker } from '@mui/x-date-pickers';

const fields = [
    { value: 'customer.commercialTitle', label: 'Müşteri Adı', type: 'string' },
    { value: 'type', label: 'İşlem Tipi', type: 'enum' },
    { value: 'createdAt', label: 'Tarih', type: 'date' },
    { value: 'finalAmount', label: 'Son Tutar', type: 'number' },
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

const dateOperators = [
    { value: 'equals', label: 'Eşittir' },
    { value: 'gt', label: 'Sonra' },
    { value: 'lt', label: 'Önce' },
];

const transactionTypeOptions = [
    { value: 'SALE', label: localizeTransactionType('SALE') },
    { value: 'PURCHASE', label: localizeTransactionType('PURCHASE') },
    { value: 'PAYMENT', label: localizeTransactionType('PAYMENT') },
    { value: 'COLLECTION', label: localizeTransactionType('COLLECTION') },
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

const TransactionFilter: React.FC<Props> = ({ filter, setFilter, onApply }) => {
    const selectedField = fields.find(f => f.value === filter.field);

    const handleFieldChange = (event: SelectChangeEvent<string>) => {
        const field = event.target.value;
        const type = fields.find(f => f.value === field)?.type ?? 'string';
        let operator = 'contains';
        if (type === 'number') operator = 'equals';
        if (type === 'date') operator = 'equals';
        if (type === 'enum') operator = 'equals';
        setFilter({ field, operator, value: '' });
    };

    const getOperators = () => {
        if (!selectedField) return stringOperators;
        switch (selectedField.type) {
            case 'string': return stringOperators;
            case 'number': return numberOperators;
            case 'date': return dateOperators;
            case 'enum': return [{ value: 'equals', label: 'Eşittir' }];
            default: return stringOperators;
        }
    };

    const getValueInput = () => {
        if (!selectedField) return (
            <TextField
                label="Değer"
                value={filter.value}
                onChange={(e) => setFilter({ ...filter, value: e.target.value })}
                size='small'
            />
        );

        switch (selectedField.type) {
            case 'string':
            case 'number':
                return (
                    <TextField
                        label="Değer"
                        value={filter.value}
                        type={selectedField.type === 'number' ? 'number' : 'text'}
                        onChange={(e) => setFilter({ ...filter, value: e.target.value })}
                        size='small'
                    />
                );
            case 'date':
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                        <DatePicker
                            label="Tarih"
                            value={filter.value ? new Date(filter.value) : null}
                            onChange={(date: Date | null) => {
                                setFilter({ ...filter, value: date ? date.toISOString() : '' });
                            }}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </LocalizationProvider>
                );
            case 'enum':
                return (
                    <FormControl size='small' sx={{ width: 200 }}>
                        <InputLabel>Değer</InputLabel>
                        <Select
                            value={filter.value}
                            label="Değer"
                            onChange={(e) => setFilter({ ...filter, value: e.target.value })}
                        >
                            {transactionTypeOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            default:
                return (
                    <TextField
                        label="Değer"
                        value={filter.value}
                        onChange={(e) => setFilter({ ...filter, value: e.target.value })}
                        size='small'
                    />
                );
        }
    };

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
                    {getOperators().map((op) => (
                        <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {getValueInput()}

            <Button variant="contained" onClick={onApply} sx={{ height: 40 }}>Uygula</Button>
        </Box>
    );
};

export default TransactionFilter;