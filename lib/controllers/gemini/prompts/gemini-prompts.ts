export const GeminiPrompt = {
  musicMatcher: (
    subject: string,
    potentials: string
  ) => `You will be provided with the subject user's musical preferences and the preferences of other users. 
    Your task is to analyze these preferences and determine the best musical matches for the subject user.

    Subject User Preferences: 
    {subject_user_preferences}

    Other Users' Preferences:
    {other_users_preferences}

    Output an array of the user Ids ordered by the best match to the subject user.  Also output the reasoning behind the match.

    Example:

    Subject User Preferences:
        {
      "userId": "user123",
      "data": [
        {
          "mediaType": "track",
          "mediaContent": {
            "artistName": "Taylor Swift",
            "label": "Pop"
          }
        },
        {
          "mediaType": "artist",
          "mediaContent": {
            "artistName": "The Weeknd",
            "label": "R&B"
          }
        }
      ]
    }

    Other Users' Preferences:
    [
      {
        "userId": "user456",
        "data": [
          {
            "mediaType": "track",
            "mediaContent": {
            "artistName": "Taylor Swift",
            "label": "Pop"
            }
          }
        ]
      },
      {
        "userId": "user789",
        "data": [
          {
            "mediaType": "artist",
            "mediaContent": {
              "artistName": "The Weekend",
              "label": "R&B"
            }
          },
          {
            "mediaType": "track",
            "mediaContent": {
              "artistName": "Dua Lipa",
              "label": "Pop"
            }
          }
        ]
      },
        {
        "userId": "user000",
        "data": [
          {
            "mediaType": "artist",
            "mediaContent": {
              "artistName": "Justin Bieber",
              "label": "Pop"
            }
          }
        ]
      }
    ]
    Output: data: [user456, user789, user000], reason: "this is my reasoning"

    Subject User Preferences:
    ${subject}

    Other Users' Preferences:
    ${potentials}
  `,
};
