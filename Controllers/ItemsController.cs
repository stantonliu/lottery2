﻿using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Lottery.Entities;
using Lottery.Helpers;
using Lottery.Models.Item;
using Lottery.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lottery.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IItemRepository _itemRepository;

        public ItemsController(IMapper mapper, IItemRepository itemRepository)
        {
            _mapper = mapper;
            _itemRepository = itemRepository;
        }
    
        [HttpGet("all", Name = nameof(GetAllItems))]
        public async Task<ActionResult<IEnumerable<ItemViewModel>>> GetAllItems()
        {
            var entities = await _itemRepository.GetAllItemsAsync();

            var models = _mapper.Map<IEnumerable<ItemViewModel>>(entities);
            
            return Ok(models);
        }

        [HttpGet("length", Name = nameof(GetAllItemsLength))]
        public async Task<ActionResult<int>> GetAllItemsLength()
        {
            var model = await _itemRepository.GetAllItemsLengthAsync();

            return Ok(model);
        }
    
        [HttpGet(Name = nameof(GetItems))]
        public async Task<ActionResult<IEnumerable<ItemViewModel>>> GetItems([FromQuery] ItemResourceParameters parameters)
        {
            var skipNumber = parameters.PageSize * (parameters.PageNumber - 1);
            var takeNumber = parameters.PageSize;

            var entities = await _itemRepository.GetItemsAsync(skipNumber, takeNumber);

            var models = _mapper.Map<IEnumerable<ItemViewModel>>(entities);
            
            return Ok(models);
        }

        [HttpGet("{itemId}", Name = nameof(GetItemById))]
        public async Task<ActionResult<ItemViewModel>> GetItemById(string itemId)
        {
            var entity = await _itemRepository.GetItemByIdAsync(itemId);

            var model = _mapper.Map<ItemViewModel>(entity);
            
            return Ok(model);
        }

        [HttpPost(Name = nameof(CreateItem))]
        public async Task<IActionResult> CreateItem(ItemAddViewModel model)
        {
            var entity = _mapper.Map<Item>(model);
            
            _itemRepository.CreateItem(entity);
            
            var result = await _itemRepository.SaveAsync();
            if (!result) return BadRequest();
            
            var returnModel = _mapper.Map<ItemViewModel>(entity);
            
            return CreatedAtRoute(nameof(GetItemById), new { itemId = returnModel.Id }, returnModel);
        }

        [HttpDelete("{itemId}", Name = nameof(DeleteItem))]
        public async Task<IActionResult> DeleteItem(string itemId)
        {
            if (!await _itemRepository.ExistItemByIdAsync(itemId))
            {
                return NotFound();
            }

            await _itemRepository.DeleteItem(itemId);
            var result = await _itemRepository.SaveAsync();
            if (!result) { return BadRequest(); }

            return NoContent();
        }
    }
}