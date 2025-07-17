import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spin from "./Spin";
 
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchNews = async () => {
    props.setProgress(10);
    const { country, category, pageSize } = props;
    
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=cf23f0cdaf374ad2ac1a3b5ce9170495&page=${page}&pageSize=${pageSize}`;
    
    if (page === 1) {
      setLoading(true); // Show loading spinner for the first page load
    } else {
      setScrollLoading(true); // Show loading spinner for infinite scroll
    }

    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);

    setArticles(articles.concat(parsedData.articles)); // Append new articles to existing ones
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    setScrollLoading(false);
    props.setProgress(100); // Complete progress
    document.title = `News Monkey - ${props.category.charAt(0).toUpperCase() + props.category.slice(1)} Headlines`;

  };

  useEffect(() => {
    fetchNews(); // Fetch news on component mount
    // eslint-disable-next-line
  }, [page]); // Re-fetch when the page number changes

  const fetchMoreData = () => {
    setPage(page + 1); // Increase the page number to load more data
  };

  return (
    <div className="container my-3">
      <h1 className="text-center" style={{margin:'35px 0px',marginTop:'90px'}}> Daily News  - Top {props.category.charAt(0).toUpperCase() + props.category.slice(1)} Headlines</h1>

      {/* Show spinner while loading the first page */}
      {loading && <Spin />}

      {/* Infinite scroll for loading more articles */}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={scrollLoading && <Spin />} // Show scroll spinner
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-3 mx-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

// Default props
News.defaultProps = {
  country: 'in',
  pageSize: 20,
  category: 'general'
};

// Prop types
 

export default News;
