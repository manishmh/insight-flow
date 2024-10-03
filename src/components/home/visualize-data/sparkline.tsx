import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export default function BasicSparkLine() {
  const [showHighlight, setShowHighlight] = React.useState(true);
  const [showTooltip, setShowTooltip] = React.useState(true);

  const handleHighlightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowHighlight(event.target.checked);
  };

  const handleTooltipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowTooltip(event.target.checked);
  };

  return (
    <Stack direction="column" className="py-4 px-4 flex justify-center h-full w-full" >
        <FormControlLabel
          value="end"
          control={
            <Switch
              color="primary"
              checked={showHighlight}
              onChange={handleHighlightChange}
            />
          }
          label="showHighlight"
          labelPlacement="end"
        />
        <FormControlLabel
          value="end"
          control={
            <Switch
              color="primary"
              checked={showTooltip}
              onChange={handleTooltipChange}
            />
          }
          label="showTooltip"
          labelPlacement="end"
        />
      <Stack direction="row" sx={{ width: '100%' }}>
        <Box sx={{ flexGrow: 1 }}>
          <SparkLineChart
            data={[1, 4, 2, 5, 7, 2, 4, 6]}
            height={100}
            showHighlight={showHighlight}
            showTooltip={showTooltip}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
