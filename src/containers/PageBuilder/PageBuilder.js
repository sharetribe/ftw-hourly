import React from 'react';

import { Footer as FooterContent } from '../../components/index.js';
import './CaddieList.css'
import { TopbarContainer } from '../../containers/index.js';

import { validProps } from './Field';

import LayoutComposer from './LayoutComposer/index.js';
import SectionBuilder from './SectionBuilder/SectionBuilder.js';
import StaticPage from './StaticPage.js';

import css from './PageBuilder.module.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom/cjs/react-router-dom.min.js';

const getMetadata = (meta, schemaType, fieldOptions) => {
  const { pageTitle, pageDescription, socialSharing } = meta;

  // pageTitle is used for <title> tag in addition to page schema for SEO
  const title = validProps(pageTitle, fieldOptions)?.content;
  // pageDescription is used for different <meta> tags in addition to page schema for SEO
  const description = validProps(pageDescription, fieldOptions)?.content;
  // Data used when the page is shared in social media services
  const openGraph = validProps(socialSharing, fieldOptions);
  // We add OpenGraph image as schema image if it exists.
  const schemaImage = openGraph?.images1200?.[0]?.url;
  const schemaImageMaybe = schemaImage ? { image: [schemaImage] } : {};
  const isArticle = ['Article', 'NewsArticle', 'TechArticle'].includes(schemaType);
  const schemaHeadlineMaybe = isArticle ? { headline: title } : {};

  // Schema for search engines (helps them to understand what this page is about)
  // http://schema.org (This template uses JSON-LD format)
  //
  // In addition to this schema data for search engines, src/components/Page/Page.js adds some extra schemas
  // Read more about schema:
  // - https://schema.org/
  // - https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data
  const pageSchemaForSEO = {
    '@context': 'http://schema.org',
    '@type': schemaType || 'WebPage',
    description: description,
    name: title,
    ...schemaHeadlineMaybe,
    ...schemaImageMaybe,
  };

  return {
    title,
    description,
    schema: pageSchemaForSEO,
    socialSharing: openGraph,
  };
};

//////////////////
// Page Builder //
//////////////////

/**
 * PageBuilder can be used to build content pages using page-asset.json.
 *
 * Note: props can include a lot of things that depend on
 * - pageAssetsData: json asset that contains instructions how to build the page content
 *   - asset should contain an array of _sections_, which might contain _fields_ and an array of _blocks_
 *     - _blocks_ can also contain _fields_
 * - fallbackPage: component. If asset loading fails, this is used instead.
 * - options: extra mapping of 3 level of sub components
 *   - sectionComponents: { ['my-section-type']: { component: MySection } }
 *   - blockComponents: { ['my-component-type']: { component: MyBlock } }
 *   - fieldComponents: { ['my-field-type']: { component: MyField, pickValidProps: data => Number.isInteger(data.content) ? { content: data.content } : {} }
 *     - fields have this pickValidProps as an extra requirement for data validation.
 * - pageProps: props that are passed to src/components/Page/Page.js component
 *
 * @param {Object} props
 * @returns page component
 */
const PageBuilder = props => {
  const { pageAssetsData, inProgress, fallbackPage, schemaType, options, ...pageProps } = props;
  const [caddieList, setCaddieList] = React.useState([])
  if (!pageAssetsData && fallbackPage && !inProgress) {
    return fallbackPage;
  }

  // Page asset contains UI info and metadata related to it.
  // - "sections" (data that goes inside <body>)
  // - "meta" (which is data that goes inside <head>)
  const { sections = [], meta = {} } = pageAssetsData || {};
  const pageMetaProps = getMetadata(meta, schemaType, options?.fieldComponents);

  const layoutAreas = `
    topbar
    main
    footer
  `;

  const Data = useSelector(state => state.marketplaceData.entities.listing)
  const imageData = useSelector(state => state.marketplaceData.entities.image)

  const usersId = useSelector(state => state.SearchPage.currentPageResultIds)
  const [count, setCount] = React.useState(1);

  const setData = React.useCallback(() => {
    usersId?.forEach(user => {

      let images = imageData[Data[user.uuid].relationships.images.data[0].id.uuid] ? imageData[Data[user.uuid].relationships.images.data[0].id.uuid].attributes.variants : '';



      let caddieDetails = {
        name: Data[user.uuid].attributes.title,
        price: Data[user.uuid].attributes.price,
        image: images,
        userId: user.uuid
      }
      if (Data[user.uuid]) {
        setCaddieList(prevList => [...prevList, caddieDetails]);
      }
    });
  }, [usersId, Data]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setData();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [setData]);

  console.log(caddieList);
  return (
    <StaticPage {...pageMetaProps} {...pageProps}>
      <LayoutComposer areas={layoutAreas} className={css.layout}>
        {props => {
          const { Topbar, Main, Footer } = props;
          return (
            <>
              <Topbar as="header" className={css.topbar}>
                <TopbarContainer />
              </Topbar>
              <Main as="main" className={css.main}>
                <SectionBuilder sections={sections} options={options} />

              </Main>
              <Footer>


                <div className='ml-auto mr-auto text-center md:text-left p-4 w-2/3 mt-12'>
                  <span className='m-4 text-4xl  font-semibold'>Caddie List</span>

                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 md:w-2/3 ml-auto mr-auto  '>

                  {caddieList && <> {caddieList.map((caddie) => {
                    return (
                      <>
                        <div className='flex flex-row w-auto shadow md:m-4 mx-2 p-4'>
                          <div className=''>
                            <img className='md:w-32 md:h-25 w-28' src={caddie.image['landscape-crop'].url} />
                          </div>
                          <div className='flex flex-col ml-4'>
                            <span className='md:text-2xl text-xl'>{caddie.name}</span>
                            <span className='md:mt-1 mt-2 text-sm md:text-xl text-green-500'>{caddie.price.currency} - {caddie.price.amount}</span>
                            <Link to={`/l/test-listing/${caddie.userId}`}>
                              <button>View Profile</button>
                            </Link>
                          </div>
                        </div>
                      </>
                    )
                  })} </>}
                </div>
                <FooterContent />
              </Footer>
            </>
          );
        }}
      </LayoutComposer>
    </StaticPage>
  );
};

export { StaticPage, SectionBuilder };

export default PageBuilder;
