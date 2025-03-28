# WakaTime Stats Integration

This directory contains the WakaTime integration for displaying coding statistics on the website.

## How It Works

The integration uses WakaTime's embeddable JSON endpoints to fetch coding statistics data and display it in a user-friendly way.

### Data Sources

WakaTime provides embeddable charts and JSON data from their "Embeddable Charts" section in the dashboard. The integration uses the following data endpoints:

- **Coding Activity**: Daily coding time
- **Languages**: Programming languages used
- **Editors**: IDEs and text editors used
- **Operating Systems**: Operating systems used for coding

### Technical Implementation

1. **Server-side API Proxy**:

   - Located at `/api/wakatime/route.ts`
   - Prevents CORS issues when fetching from client-side
   - Keeps API keys and embeddable URLs secure

2. **Stats Page Component**:

   - Uses React hooks to fetch and display data
   - Provides multiple visualization options (progress bars, bar charts, tables)
   - Handles empty states and loading states

3. **Visualization Components**:
   - `ActivityChart`: Shows daily coding activity with progress bars
   - `ProgressBarChart`: Displays percentage-based stats with horizontal bars
   - `BarChart`: Vertical bar chart visualization
   - `TableView`: Tabular data presentation

## Available Views

- **Activity**: Daily coding activity with progress bars and summary stats
- **Languages**: Programming languages used with percentage breakdown
- **Editors**: Code editors used with percentage breakdown
- **OS**: Operating systems used with percentage breakdown

## WakaTime API Reference

For more information on the WakaTime API, refer to:

- [WakaTime API Documentation](https://wakatime.com/developers)
- [Embeddable Charts & JSON](https://wakatime.com/share/embed)

## Setup Instructions

1. Log in to your WakaTime account
2. Go to "Embeddable Charts" from your profile menu
3. Choose "JSON" format for each chart type you want to display
4. Copy the generated URLs and update the `WAKATIME_ENDPOINTS` object in `page.tsx`

Example endpoint format:

```
https://wakatime.com/share/@[USER_ID]/[CHART_ID].json
```

## Maintaining Endpoints

WakaTime embeddable chart URLs may expire or become invalid over time. If you see 404 errors in the console or the stats page shows error messages, follow these steps:

1. Visit [WakaTime Embeddable Charts](https://wakatime.com/share/embed)
2. Generate new embeddable charts for all required types:
   - Coding Activity (Bar Chart)
   - Languages (Pie Chart)
   - Editors (Pie Chart)
   - Operating Systems (Pie Chart)
3. For each chart, select the "JSON" format and copy the URL
4. Update the URLs in the `WAKATIME_ENDPOINTS` object in `page.tsx`

## Troubleshooting

If you're experiencing issues with the WakaTime integration:

1. **404 Errors**: Embeddable URLs have likely expired - generate new ones (see above)
2. **Empty Data**: Check that your WakaTime account has collected activity data
3. **Rendering Issues**: Ensure all data formats match expected schemas
4. **Loading Indefinitely**: Check network requests for errors and verify endpoint URLs

The stats page includes built-in error handling with helpful messages and endpoint regeneration guidance when problems occur.
