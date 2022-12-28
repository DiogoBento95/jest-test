import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Observable, of } from "rxjs";
import { Book } from "src/app/models/book.model";
import { ReduceTextPipe } from "src/app/pipes/reduce-text/reduce-text.pipe";
import { BookService } from "../../services/book.service";
import { HomeComponent } from "./home.component";

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

//Mocking a Service
const bookServiceMock = {
  getBooks: () => of(listBook)
};

//Mocking a Pipe
@Pipe({ name: 'reduceText'})
class ReducePipeMock implements PipeTransform {
  transform() : string {
      return '';
  }
}

describe('Home component', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        HomeComponent,
        ReducePipeMock
      ],
      providers: [
        //BookService
        {
          provide: BookService,
          useValue: bookServiceMock
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

it('should create', () => {
  expect(component).toBeTruthy();
});


/*public getBooks(): void {
  this.bookService.getBooks().pipe(take(1)).subscribe((resp: Book[]) => {
    this.listBook = resp;
  });
}*/

it('getBook get books from the subscription', () => {
  const bookService = fixture.debugElement.injector.get(BookService);
  //const spy1 = jest.spyOn(bookService, 'getBooks').mockReturnValueOnce( of(listBook) );
  component.getBooks();
  //expect(spy1).toHaveBeenCalledTimes(1);  //Commented both lines because now that we mocked the service we don't need the spy anymore.
  expect(component.listBook.length).toBe(3);
  expect(component.listBook).toEqual(listBook);
});

// Best to mock a Service when you have a Service with a lot of functions, so as to not create a lot of spies.

});
