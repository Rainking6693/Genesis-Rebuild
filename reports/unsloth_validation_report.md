======================================================================
UNSLOTH TRAINING DATA VALIDATION REPORT
======================================================================

Total examples: 99,990
✅ Format valid: 99,990 (100.0%)
❌ Invalid: 0 (0.0%)
⚠️  Warnings: 0

----------------------------------------------------------------------
AGENT BREAKDOWN
----------------------------------------------------------------------

analyst_agent:
  Total examples:      19,998
  Valid:               19,998 (100.0%)
  Invalid:             0
  Warnings:            0

  Error breakdown:
    Format errors:     0
    Weight errors:     0
    Content errors:    0

  Distribution:
    easy        11731 ( 58.7%)
    hard           65 (  0.3%)
    medium       8202 ( 41.0%)
  Top source agents:
    legal_agent            5681 ( 28.4%)
    support_agent          4869 ( 24.3%)
    content_agent          4869 ( 24.3%)
    qa_agent               3246 ( 16.2%)
    analyst_agent          1333 (  6.7%)
  Weight distribution:
    1.0          1333 (  6.7%)
    0.7-0.9      5681 ( 28.4%)
    0.4-0.6     12984 ( 64.9%)

content_agent:
  Total examples:      19,998
  Valid:               19,998 (100.0%)
  Invalid:             0
  Warnings:            0

  Error breakdown:
    Format errors:     0
    Weight errors:     0
    Content errors:    0

  Distribution:
    easy        11691 ( 58.5%)
    hard           89 (  0.4%)
    medium       8218 ( 41.1%)
  Top source agents:
    analyst_agent          5894 ( 29.5%)
    legal_agent            4912 ( 24.6%)
    support_agent          4912 ( 24.6%)
    qa_agent               2947 ( 14.7%)
    content_agent          1333 (  6.7%)
  Weight distribution:
    1.0          1333 (  6.7%)
    0.4-0.6     15718 ( 78.6%)
    0.2-0.3      2947 ( 14.7%)

legal_agent:
  Total examples:      19,998
  Valid:               19,998 (100.0%)
  Invalid:             0
  Warnings:            0

  Error breakdown:
    Format errors:     0
    Weight errors:     0
    Content errors:    0

  Distribution:
    easy        11634 ( 58.2%)
    hard           85 (  0.4%)
    medium       8279 ( 41.4%)
  Top source agents:
    analyst_agent          6222 ( 31.1%)
    support_agent          5444 ( 27.2%)
    content_agent          4666 ( 23.3%)
    qa_agent               2333 ( 11.7%)
    legal_agent            1333 (  6.7%)
  Weight distribution:
    1.0          1333 (  6.7%)
    0.7-0.9     11666 ( 58.3%)
    0.4-0.6      4666 ( 23.3%)
    0.2-0.3      2333 ( 11.7%)

qa_agent:
  Total examples:      19,997
  Valid:               19,997 (100.0%)
  Invalid:             0
  Warnings:            0

  Error breakdown:
    Format errors:     0
    Weight errors:     0
    Content errors:    0

  Distribution:
    easy        11458 ( 57.3%)
    hard          118 (  0.6%)
    medium       8421 ( 42.1%)
  Top source agents:
    support_agent          7466 ( 37.3%)
    analyst_agent          4977 ( 24.9%)
    content_agent          3733 ( 18.7%)
    legal_agent            2488 ( 12.4%)
    qa_agent               1333 (  6.7%)
  Weight distribution:
    1.0          1333 (  6.7%)
    0.4-0.6     12443 ( 62.2%)
    0.2-0.3      6221 ( 31.1%)

support_agent:
  Total examples:      19,999
  Valid:               19,999 (100.0%)
  Invalid:             0
  Warnings:            0

  Error breakdown:
    Format errors:     0
    Weight errors:     0
    Content errors:    0

  Distribution:
    easy        11813 ( 59.1%)
    hard           22 (  0.1%)
    medium       8164 ( 40.8%)
  Top source agents:
    legal_agent            5939 ( 29.7%)
    qa_agent               5091 ( 25.5%)
    analyst_agent          4242 ( 21.2%)
    content_agent          3394 ( 17.0%)
    support_agent          1333 (  6.7%)
  Weight distribution:
    1.0          1333 (  6.7%)
    0.7-0.9      5939 ( 29.7%)
    0.4-0.6     12727 ( 63.6%)

----------------------------------------------------------------------
QUALITY ASSESSMENT
----------------------------------------------------------------------
Overall quality score: 100.0%

✅ READY FOR TRAINING: YES
   Excellent quality - proceed with fine-tuning

======================================================================