import { Paper, Typography } from "@mui/material";

export default function Benefit({ label, value }: { label: string; value: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        p: 2,
        background: '#fff',
      }}
    >
      <Typography color="text.secondary" fontSize={13}>
        {label}
      </Typography>
      <Typography fontSize={18} fontWeight={950}>
        {value}
      </Typography>
    </Paper>
  )
}