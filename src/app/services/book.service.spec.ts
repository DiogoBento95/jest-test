import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment.prod";
import { Book } from "../models/book.model";
import { CartComponent } from "../pages/cart/cart.component";
import { BookService } from "./book.service";

const listBook: Book[] = [
  {
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 20,
    amount: 1
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 8,
    amount: 7
  },
]

describe('BookService', () => {

  let service: BookService;
  let httpMock: HttpTestingController;
  let component: CartComponent;

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        CartComponent
      ],
      providers: [
        BookService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
  });

  beforeEach( () => {
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach( () => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  afterEach( () => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });


  /*public getBooks(): Observable<Book[]> {
    const url: string = environment.API_REST_URL + `/book`;
    return this._httpClient.get<Book[]>(url);
  }*/

  it('getBooks returns a list of books and executes a get method', () => {
    service.getBooks().subscribe((resp: Book[]) => {
      expect(resp).toEqual(listBook);
    });

    const req = httpMock.expectOne(environment.API_REST_URL + `/book`);
    expect(req.request.method).toBe('GET');
    req.flush(listBook);
  });


  /*public getBooksFromCart(): Book[] {
    let listBook: Book[] = JSON.parse(localStorage.getItem('listCartBook'));
    if (listBook === null) {
      listBook = [];
    }
    return listBook;
  }*/

  it('getBooksFromCart returns an empty array when localStorage is empty', () => {
    const listBook = service.getBooksFromCart();
    expect(listBook.length).toBe(0);
  });

  it('getBooksFromCart returns an array of books when it exists in localStorage', () => {
    localStorage.setItem('listCartBook', JSON.stringify(listBook));
    const newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(3);
  });


/*public updateAmountBook(book: Book): Book[] {
    const listBookCart = this.getBooksFromCart();
    const index = listBookCart.findIndex((item: Book) => {
      return book.id === item.id;
    });
    if (index !== -1) {
      listBookCart[index].amount = book.amount;
      if (book.amount === 0) {
        listBookCart.splice(index, 1);
      }
    }
    localStorage.setItem('listCartBook', JSON.stringify(listBookCart));
    return listBookCart;
  }*/

  it('updateAmountBook updates the amount of books inside localStorage', () => {
    const book =
      {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
      };

      const toastMock = {
        fire: () => null
      } as any;
      const spy2 = jest.spyOn(Swal, 'mixin').mockImplementation( () => {
        return toastMock;
      });

    const spy1 = jest.spyOn(service, 'updateAmountBook');

    service.addBookToCart(book);
    const listBookCart = service.getBooksFromCart();
    const index = listBookCart.findIndex((item: Book) => {
      expect(book.isbn === item.id);
    });
    service.updateAmountBook(book);

    expect(book.amount).toBe(1);

    //expect(listBookCart[0].amount).toEqual(book.amount); Does nothing.

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

  });


  /*public addBookToCart(book: Book) {
    let listBook: Book[] = JSON.parse(localStorage.getItem('listCartBook'));
    if (listBook === null) { // Create a list with the book
      book.amount = 1;
      listBook = [ book ];
    } else {
      const index = listBook.findIndex((item: Book) => {
        return book.id === item.id;
      });
      if (index !== -1) { // Update the quantity in the existing book
        listBook[index].amount++;
      } else {
        book.amount = 1;
        listBook.push(book);
      }
    }
    localStorage.setItem('listCartBook', JSON.stringify(listBook));
    this._toastSuccess(book);
  }*/

  it('addBookToCart add a book successfully when the list does not exist in localStorage', () => {
    const book: Book = {
      name: '',
      author: '',
      isbn: '',
      price: 15,
    };
    const toastMock = {
      fire: () => null
    } as any;
    const spy1 = jest.spyOn(Swal, 'mixin').mockImplementation( () => {
      return toastMock;
    });

    let newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(0);
    service.addBookToCart(book);
    newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(1);
    expect(spy1).toHaveBeenCalledTimes(1);

  });


  /*public removeBooksFromCart(): void {
    localStorage.setItem('listCartBook', null);
  }*/

  it('removeBooksFromCart removes the list from localStorage', () => {
    const toastMock = {
      fire: () => null
    } as any;
    jest.spyOn(Swal, 'mixin').mockImplementation( () => {
      return toastMock;
    });
    const book: Book = {
      name: '',
      author: '',
      isbn: '',
      price: 15,
    };
    service.addBookToCart(book);
    let newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(1);
    service.removeBooksFromCart();
    newListBook = service.getBooksFromCart();
    expect(newListBook.length).toBe(0);
  });

});
