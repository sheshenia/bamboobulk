# BambooBulk Clock Entries

Adds your working hours all at once for all days in your current BambooHR pay period.

### How do I get set up?  

1) Clone or Download repository. Ready to use Chrome extension in `extension` folder.
![](_1_1_download.png)
![](_1_download.png)
2) In Chrome browser open `Manage Extensions`
![](_2_open_manage_extensions.png)
3) Enable Developer mode
![](_3_enable_developer_mode.png)
4) Press `Load Unpacked` and select `extension` folder
![](_4_load_unpacked.png)
5) You should see `Bamboo Bulk` extension installed. Enable it if it is not enabled.
![](_5_bambooBulk_installed.png)
6) Open your BambooHR timesheet page, you should see the Button `Bulk Time Entries` injected by extension.
![](_6_bamboo_timesheet.png)
7) By default we have two time entries `09AM - 01PM` and `02PM - 06PM`. 
Press button if you're Ok with default entries or follow the next steps to specify your custom time entries.

### How to specify custom time entries? 

1) Press on Bamboo Bulk extension
![](_7_press_bamboo_bulk_ext.png)
2) Select you custom time values
![](_8_select_custom_time_values.png)
3) Go back to your BambooHR timesheet page, and press `Bulk Time Entries` button to start the process

### Some usefully notes

1) The time entries are written only on your working days Monday - Friday, Weekends are ignored.
2) The time entries are not written to Holidays displayed in your timesheet.
3) The days with already written time entries are skipped.
4) Only your active `Pay period timesheet` is affected.

### TODO

1) Ability to add and delete custom time entries
2) Ability to specify days of week for custom time entries