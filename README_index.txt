Good Boy Tracker - index.html Explanation
=========================================

This file is the main interface for the Good Boy Tracker web app. It allows users to track daily activities, add custom activities, spend points, and view completed activities for the day.

Sections Overview:
------------------

1. Navigation (optional, add if needed)
   - Links to switch between the tracker and the settings page.

2. Current Date and Time
   - Displays the current date and time at the top, updated every second by JavaScript.

3. Daily Activity Tracker Title
   - The main heading for the app.

4. Add Activity Form
   - Users can manually add a new activity by entering a name and a point value.
   - On submission, the activity is added to today's list.

5. Today's Activities Table
   - Shows all activities added for the current day.
   - Each row displays the activity name, its value, and a "Remove" button to delete it from the list.

6. Total Points for Today
   - Displays the sum of all activity values added for the current day.

7. Save Today's Total Button
   - When clicked, adds today's total points to the overall points and moves today's activities to the completed list.

8. Overall Points
   - Shows the user's accumulated points across all days.

9. Spend Points Form
   - Allows the user to spend some of their overall points.
   - The input is validated to ensure the user cannot spend more points than they have.

10. Completed Activities Table
    - Lists all activities completed today, along with their point values.

11. Script Inclusion
    - The main.js script is loaded at the end of the body to provide all interactive functionality.

How It Works:
-------------

- Activities are stored in the browser's localStorage, so data persists between sessions.
- Adding, removing, and saving activities updates the tables and point totals in real time.
- The completed activities table only shows activities for the current day.
- The spend points form ensures users cannot spend more points than they have.
- All UI updates and logic are handled by main.js.

Customization:
--------------

- You can add navigation links at the top for easy access to the settings page.
- The app can be extended to use a hobbies list (editable in settings.html) for quick activity entry.

For more details, see comments in index.html