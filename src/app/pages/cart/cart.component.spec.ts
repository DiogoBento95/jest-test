import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CartComponent } from "./cart.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { BookService } from "../../services/book.service";
import { Book } from "src/app/models/book.model";
import { versions } from "process";

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

describe('Cart component', () => {

  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let service: BookService;

  beforeEach(() => {
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
    }).compileComponents();
  });


  /*ngOnInit(): void {
    this.listCartBook = this._bookService.getBooksFromCart();
    this.totalPrice = this.getTotalPrice(this.listCartBook);
  }*/

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = fixture.debugElement.injector.get(BookService);
    jest.spyOn(service, 'getBooksFromCart').mockImplementation( () => listBook);
  });

  afterEach(() => {
    fixture.destroy();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  /*public getTotalPrice(listCartBook: Book[]): number {
    let totalPrice = 0;
    listCartBook.forEach((book: Book) => {
      totalPrice += book.amount * book.price;
    });
    return totalPrice;
  }*/

  it('getTotalPrice returns an amount', () => {
    const totalPrice = component.getTotalPrice(listBook);
    expect(totalPrice).toBeGreaterThan(0);
    //expect(totalPrice).not.toBe(0);
    //expect(totalPrice).not.toBeNull();
    });


    /*public onInputNumberChange(action: string, book: Book): void {
      const amount = action === 'plus' ? book.amount + 1 : book.amount - 1;
      book.amount = Number(amount);
      this.listCartBook = this._bookService.updateAmountBook(book);
      this.totalPrice = this.getTotalPrice(this.listCartBook);
    }*/

    it('onInputNumberChange increments correctly', () => {
      const action = 'plus'
      const book: Book = {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
      }

      //const service = fixture.debugElement.injector.get(BookService); - Correct way of doing it. (See variable 'service' below describe and inside beforeEach)

      const spy1 = jest.spyOn(service, 'updateAmountBook').mockImplementation( () => null);
      const spy2 = jest.spyOn(component, 'getTotalPrice').mockImplementation( () => null);

      expect(book.amount).toBe(2);
      component.onInputNumberChange(action, book);
      expect(book.amount).toBe(3);

      expect(spy1).toHaveBeenCalled();       //Same as below, basically.
      expect(spy2).toHaveBeenCalledTimes(1);
    });

    it('onInputNumberChange decrements correctly', () => {
      const action = 'minus'
      const book: Book = {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
      }

      const spy1 = jest.spyOn(service, 'updateAmountBook').mockImplementation( () => null);
      const spy2 = jest.spyOn(component, 'getTotalPrice').mockImplementation( () => null);

      expect(book.amount).toBe(2);
      component.onInputNumberChange(action, book);
      expect(book.amount).toBe(1);
      //expect(book.amount === 1).toBe(true); Another alternative way of doing it.

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });


    /*public onClearBooks(): void {
      if (this.listCartBook && this.listCartBook.length > 0) {
        this._clearListCartBook();
      } else {
         console.log("No books available");
      }
    }

    private _clearListCartBook() {
      this.listCartBook = [];
      this._bookService.removeBooksFromCart();
    }*/

    it('onClearBooks works correctly', () => {
      const spy1 = jest.spyOn(service, 'removeBooksFromCart').mockImplementation( () => null );
      const spy2 = jest.spyOn(component as any, '_clearListCartBook'); //As any due to the fact that the function is private.
      component.listCartBook = listBook;
      component.onClearBooks();
      expect(component.listCartBook.length).toBe(0);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
    });

    // Another way of doing it. (Testing the private function).
    it('_clearListCartBook works correctly', () => {
      const spy1 = jest.spyOn(service, 'removeBooksFromCart').mockImplementation( () => null );
      component.listCartBook = listBook;
      component['_clearListCartBook'](); //This is not recommended.
      expect(component.listCartBook.length).toBe(0);
      expect(spy1).toHaveBeenCalledTimes(1);
    });


});
