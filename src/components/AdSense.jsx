import React, { useEffect } from 'react';

export default function AdSense({ slot = '8015104816' }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense push failed:', e);
    }
  }, []);

  return (
    <div className="w-full my-6 overflow-hidden flex justify-center border border-border-card bg-bg-card-inner/30 rounded-2xl p-4 flex-col items-center gap-2">
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3123345075285868"
           crossorigin="anonymous"></script>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '250px' }}
        data-ad-client="ca-pub-3123345075285868"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
