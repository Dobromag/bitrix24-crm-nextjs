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
import type { OrdersFilters } from "../../types";

interface FiltersProps {
  filters: OrdersFilters;
  onChange: (filters: OrdersFilters) => void;
}

export const Filters = ({ filters, onChange }: FiltersProps) => {
  // 🔹 Универсальный обработчик для TextField
  const handleInputChange = useCallback(
    (key: keyof OrdersFilters) => (e: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...filters, [key]: e.target.value });
    },
    [filters, onChange]
  );

  // 🔹 Универсальный обработчик для Select
  const handleSelectChange = useCallback(
    (key: keyof OrdersFilters) => (e: SelectChangeEvent) => {
      onChange({ ...filters, [key]: e.target.value });
    },
    [filters, onChange]
  );

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      {/* Поиск */}
      <TextField
        label="Поиск по названию"
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
          <MenuItem value="NEW">Новый</MenuItem>
          <MenuItem value="PREPARATION">Подготовка</MenuItem>
          <MenuItem value="PREPAYMENT_INVOICE">Предоплата</MenuItem>
          <MenuItem value="EXECUTING">Выполнение</MenuItem>
          <MenuItem value="FINAL_INVOICE">Финальный счёт</MenuItem>
          <MenuItem value="CLOSED">Закрыто</MenuItem>
          <MenuItem value="WON">Успешно</MenuItem>
          <MenuItem value="LOST">Провал</MenuItem>
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
