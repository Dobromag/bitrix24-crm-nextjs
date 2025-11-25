import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChangeEvent, useCallback } from "react";
import type { PaymentsFilters } from "../../types";

interface FiltersProps {
  filters: PaymentsFilters;
  onChange: (filters: PaymentsFilters) => void;
}

export const Filters = ({ filters, onChange }: FiltersProps) => {
  // 🔹 Универсальный обработчик для TextField (input, date и т.д.)
  const handleInputChange = useCallback(
    (key: keyof PaymentsFilters) => (e: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...filters, [key]: e.target.value });
    },
    [filters, onChange]
  );

  // 🔹 Универсальный обработчик для Select
  const handleSelectChange = useCallback(
    (key: keyof PaymentsFilters) => (e: SelectChangeEvent) => {
      onChange({ ...filters, [key]: e.target.value });
    },
    [filters, onChange]
  );

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      {/* Поиск по номеру */}
      <TextField
        label="Поиск по номеру"
        variant="outlined"
        size="small"
        value={filters.search}
        onChange={handleInputChange("search")}
        sx={{ minWidth: 200 }}
      />

      {/* Статус */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Статус</InputLabel>
        <Select
          value={filters.status}
          onChange={handleSelectChange("status")}
          label="Статус"
        >
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="paid">Оплачено</MenuItem>
          <MenuItem value="unpaid">Не оплачено</MenuItem>
          <MenuItem value="overdue">Просрочено</MenuItem>
        </Select>
      </FormControl>

      {/* Дата от */}
      <TextField
        label="Дата от"
        type="date"
        variant="outlined"
        size="small"
        value={filters.dateFrom ?? ""}
        onChange={handleInputChange("dateFrom")}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        sx={{ minWidth: 150 }}
      />

      {/* Дата до */}
      <TextField
        label="Дата до"
        type="date"
        variant="outlined"
        size="small"
        value={filters.dateTo ?? ""}
        onChange={handleInputChange("dateTo")}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        sx={{ minWidth: 150 }}
      />
    </Box>
  );
};
