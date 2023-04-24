module.exports = {
  siteMetadata: {
    title: `FaiChou's Blog`,
    author: `FaiChou`,
    description: `FaiChou's personal blog`,
    siteUrl: `http://faichou.com`,
    social: {
      twitter: `faichou_zh`
    },
    categories: [
      {
        name: "Dev",
        slug: "dev",
        color: "#0c9ee4"
      },
      {
        name: "Life",
        slug: "life",
        color: "#f7615f"
      },
      {
        name: "Translate",
        slug: "translate",
        color: "#ffa22b"
      },
      {
        name: "Other",
        slug: "other",
        color: "#ffa22b"
      }
    ]
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-code-titles`,
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 650,
              height: 365
            }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700,
              linkImagesToOriginal: false
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`
            }
          },
          {
            resolve: "gatsby-remark-custom-blocks",
            options: {
              blocks: {
                simple: {
                  classes: "simple",
                  title: "optional"
                },
                info: {
                  classes: "info",
                  title: "optional"
                },
                alert: {
                  classes: "alert",
                  title: "optional"
                },
                notice: {
                  classes: "notice",
                  title: "optional"
                },
                imageSmall: {
                  classes: "image-small"
                },
                imageMedium: {
                  classes: "image-medium"
                }
              }
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              noInlineHighlight: false
            }
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`
        ]
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `FaiChou | FaiChouのpersonal blog`,
        short_name: `FaiChou`,
        start_url: `/`,
        background_color: `rgb(33, 36, 45)`,
        theme_color: `#0c9ee4`,
        display: `minimal-ui`,
        icon: `content/assets/avatar.png`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-76696304-1"
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`
      }
    },
    `gatsby-plugin-twitter`,
    // `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`
  ]
};
