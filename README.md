# Holidaze

Holidaze is a venue booking website developed as part of Noroff Project Exam 2.

The idea behind the project is to make it easier for users to find and book accommodation. Visitors can browse venues, search for places to stay and check availability. Users can also create an account to manage their bookings, while venue managers can add and manage their own venues.

## Links

- **Live site:** https://exam-project-2-holidaze.netlify.app
- **GitHub repository:** https://github.com/JulieSunde/exam-project-2-holidaze.git
- **Figma design:** https://www.figma.com/design/KINOU5B0LXOf4sYwCfDuBC/Holidaze-prototype-and-style-guide?node-id=0-1&t=6E93EhFsplJDm3pd-1
- **Style guide:** https://www.figma.com/design/KINOU5B0LXOf4sYwCfDuBC/Holidaze-prototype-and-style-guide?node-id=293062&t=6E93EhFsplJDm3pd1
- **Gantt chart:** https://docs.google.com/spreadsheets/d/1P-Bl3e-qmFib640r_kuatWx56Rt6QgG7D2c6VhXnR_Y/edit?usp=sharing
- **Kanban board:** https://trello.com/invite/b/6ad203bed0e60d0e6a6d4d47/ATTIb2adfb77745d9fc5cb87db4669b52f4619B2BF78/holidaze-project-exam2

## What you can do

### As a visitor

- Browse all available venues.
- Search by destination and number of guests.
- View details about a venue.
- Check available dates in the calendar.
- Register and log in.

### As a customer

- Book a venue.
- View upcoming bookings.
- Change or cancel bookings.
- Update your profile avatar.

### As a venue manager

- Create new venues.
- Edit existing venues.
- Delete venues.
- View bookings for your venues.

## Technologies

The project was built using:

- React
- JavaScript
- Vite
- React Router
- Bootstrap 5
- CSS
- Noroff API

## Installation

To run the project locally, follow these steps.

**1. Clone the repository**

```bash
git clone https://github.com/JulieSunde/exam-project-2-holidaze.git
```

**2. Go into the project folder**

```bash
cd holidaze
```

**3. Install dependencies**

```bash
npm install
```

**4. Set up the environment variable**

Create a `.env` file in the root folder and add your Noroff API key:

```env
VITE_NOROFF_API_KEY=your_api_key_here
```

Replace the example value with your own API key. Do not upload your `.env` file or API key to GitHub.

**5. Start the development server**

```bash
npm run dev
```

Vite will provide a local URL where you can open the application in your browser.

## Testing

To test the application, you can:

1. Browse the venues on the homepage.
2. Search for a destination and select the number of guests.
3. Open a venue and check its details and availability calendar.
4. Register using a valid `@stud.noroff.no` email address.
5. Log in and make a booking.
6. Visit your profile and try updating your avatar.
7. View, edit or cancel your bookings.
8. Log in as a venue manager and try creating, editing and deleting venues.
9. Check the bookings for venues managed by your account.
10. Log out.

## Project structure

```text
src/
├── api/                 # API functions
├── components/          # Reusable components
│   └── manager/         # Manager-specific components
├── context/             # Authentication context
├── pages/               # Application pages
├── styles/              # CSS files
├── App.jsx
└── main.jsx
```

## Build

To create a production build, run:

```bash
npm run build
```

The generated files will be placed in the `dist` folder.

## About

This project was created as part of the Frontend Development course at Noroff.
