/**
 * Created by Hakim on 2018/3/7.
 */
import React from 'react'
import BookInfor from './BookInfor'
import {Link} from 'react-router-dom'
import { Debounce } from 'react-throttle'
import * as BooksAPI from './../BooksAPI'
class Search extends React.Component{
  constructor(props){
    super(props);
    this.state={
      bookListSearch:[],
      value:''
    }
    this.handChange=this.handChange.bind(this);
    this.newbookList=this.props.bookList;
  }
  componentDidMount(){
    //this.bookList= SessionApi.getSessionStorage();

  }
  handChange(e){
    let value=e.target.value;
    let self=this;
    if (value.toString().length>0){
      BooksAPI.search(value).then((data)=>{
        console.log(self.newbookList);
        if(Array.isArray(data)){
          let newData=data.map(function (val) {
            val.authors = (val.authors) ? val.authors :'';
            val.imageLinks =(val.authors) ? val.imageLinks : {};
            val.imageLinks.smallThumbnail =(val.imageLinks.smallThumbnail) ? val.imageLinks.smallThumbnail:'';
            val.title=(val.title) ? val.title:'';
            for(let book of self.newbookList){
              if(book.id == val.id){
                val.shelf=book.shelf;
                break;
              }else {
                val.shelf='none'
              }
            }
            return val;
          })
          self.setState(function (prevState,props) {
            return {
              bookListSearch:newData,
              value:value
            }
          })
        }else {
          self.setState(function (prevState,props) {
            return {
              bookListSearch:[],
              value:value
            }
          })
        };
      }).then(()=>console.log(self.state.bookListSearch));
    }else {
      self.setState(function (prevState,props) {
        return {
          bookListSearch:[],
          value:value
        }
      })
    }
  }
  render(){
    let domLi=[];
    let self=this;
    this.state.bookListSearch.forEach(function (val,index) {
      domLi.push(<li key={val.id}> <BookInfor book={val} moveBook={self.props.moveBook}/>  </li>)
    });
    return(
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/"></Link>
          <div className="search-books-input-wrapper">
            <Debounce time="400" handler="onChange">
              <input type="text" placeholder="Search by title or author"  onChange={this.handChange}/>
            </Debounce>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {domLi}
          </ol>
        </div>
      </div>
    );
  }
}
export default Search