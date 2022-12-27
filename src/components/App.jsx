import React, { Component } from 'react';

import { fetchImages } from './services/api';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';

export class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    page: 1,
    per_page: 12,
    isLoading: false,
    loadMore: false,
    showModal: false,
    largeImageURL: '',
  };

  componentDidUpdate(_, prevState) {
    const { searchQuery, page } = this.state;
    if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
      this.getImages(searchQuery, page);
    }
  }

  getImages = async (query, page) => {
    this.setState({ isLoading: true });
    try {
      const { hits, totalHits } = await fetchImages(query, page);
      this.setState(prevState => ({
        images: [...prevState.images, ...hits],
        loadMore: Math.ceil(totalHits / this.state.per_page),
      }));
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  hendleSubmit = searchQuery => {
    this.setState({
      searchQuery,
      images: [],
      page: 1, 
    });
  };

  hendleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  openModal = largeImageURL => {
    this.setState({
      showModal: true,
      largeImageURL: largeImageURL,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  render() {
    const { images, isLoading, loadMore, showModal, largeImageURL } =
      this.state;
    
    return (
      <>
        <Searchbar onSubmit={this.hendleSubmit} />
        <ImageGallery images={images} openModal={this.openModal} />
        {isLoading && <Loader isLoading={isLoading} />}
        {loadMore && <Button onLoadMore={this.hendleLoadMore} />}
        {showModal && (<Modal largeImageURL={largeImageURL} onClose={this.closeModal} />)}
      </>
    );
  }
}