import { Box, Typography } from '@mui/joy';

export function VerityAdUnit() {
  if (process.env.REACT_APP_ENV === 'dev') {
    return (
      <Box bgcolor="red" width="728px" height="90px">
        <Typography>Verity Ad Unit</Typography>
      </Box>
    );
  }

  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2030121015199108"
        crossOrigin="anonymous"
      ></script>
      {/* <!-- verity-unit --> */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2030121015199108"
        data-ad-slot="7153484447"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </>
  );
}
