import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment.prod";
import { Book } from "../models/book.model";
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

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
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


});
