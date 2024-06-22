import { useEffect } from 'react';
import { Box, Typography } from '@mui/joy';

export function VerityAdUnit() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  if (process.env.REACT_APP_ENV !== 'dev') {
    return (
      <Box bgcolor="red" width="728px" height="90px">
        <Typography>Verity Ad Unit</Typography>
      </Box>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-2030121015199108"
      data-ad-slot="7153484447"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
