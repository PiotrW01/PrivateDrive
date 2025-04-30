import { TestBed } from '@angular/core/testing';

import { ItemSortService } from './item-sort.service';

describe('ItemSortService', () => {
    let service: ItemSortService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ItemSortService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
