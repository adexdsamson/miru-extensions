import fetch from 'node-fetch';

export default class AniListSource {
  name = 'AniList'
  description = 'Fetches anime details and streaming links from AniList'
  accuracy = 'High'

  /**
   * AniList GraphQL API Endpoint
   */
  static API_URL = 'https://graphql.anilist.co';

  /**
   * Helper method to execute GraphQL queries
   * @param {string} query - The GraphQL query string
   * @param {object} variables - The variables for the query
   * @returns {Promise<object>} - The response data from AniList
   */
  async executeQuery(query, variables) {
    const response = await fetch(AniListSource.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Gets results for a single episode
   * @type {import('./type-definitions').SearchFunction} options - The search options
   * @returns {Promise<object>} - The search result
   */
  async single(options) {
    const query = `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          episodes
          streamingEpisodes {
            title
            url
          }
        }
      }
    `;

    const variables = { search: options.titles };
    const result = await this.executeQuery(query, variables);
    return result.Media;
  }

  /**
   * Gets results for a batch of episodes
   * @param {object} options - The search options
   * @returns {Promise<object[]>} - The search results
   */
  async batch(options) {
    const query = `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          episodes
          streamingEpisodes {
            title
            url
          }
        }
      }
    `;

    const variables = { search: options.query };
    const result = await this.executeQuery(query, variables);
    return result.Media.streamingEpisodes || [];
  }

  /**
   * Gets results for a movie
   * @type {import('./type-definitions').SearchFunction} options - The search options
   * @returns {Promise<object>} - The search result
   */
  async movie(options) {
    const query = `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          duration
          streamingEpisodes {
            title
            url
          }
        }
      }
    `;

    const variables = { search: options.titles[0] };
    const result = await this.executeQuery(query, variables);
    return result.Media;
  }
}
